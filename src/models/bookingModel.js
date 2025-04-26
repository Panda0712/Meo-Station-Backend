import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { pagingSkipValue } from "~/utils/algorithms";
import {
  BOOKING_MODE,
  BOOKING_STATUS,
  PAYMENT_METHODS,
} from "~/utils/constants";
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  PHONE_RULE,
  PHONE_RULE_MESSAGE,
} from "~/utils/validators";

const BOOKING_COLLECTION_NAME = "bookings";
const BOOKING_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  userName: Joi.string().required().min(5).trim().strict(),
  userEmail: Joi.string()
    .required()
    .pattern(EMAIL_RULE)
    .message(EMAIL_RULE_MESSAGE),

  phone: Joi.string()
    .required()
    .pattern(PHONE_RULE)
    .message(PHONE_RULE_MESSAGE),
  hotelId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  hotelImages: Joi.array().items(Joi.string().required()).length(3),
  hotelLocation: Joi.string().required().min(10).trim().strict(),
  hotelName: Joi.string().required().min(5).trim().strict(),

  paymentMethod: Joi.string()
    .required()
    .valid(PAYMENT_METHODS.CASH, PAYMENT_METHODS.MOMO, PAYMENT_METHODS.ZALOPAY),
  status: Joi.string()
    .required()
    .valid(
      BOOKING_STATUS.CANCELLED,
      BOOKING_STATUS.PENDING,
      BOOKING_STATUS.COMPLETED
    ),
  mode: Joi.string().required().valid(BOOKING_MODE.night, BOOKING_MODE.day),
  checkInDate: Joi.string().isoDate().required(),
  checkOutDate: Joi.string().isoDate().required(),
  numberOfNights: Joi.number().optional(),
  guest: Joi.number().required(),
  totalPrice: Joi.number().required(),
  note: Joi.string().allow("").optional(),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const INVALID_UPDATE_FIELDS = [
  "_id",
  "createdAt",
  "userId",
  "userEmail",
  "userName",
  "hotelId",
];

const validateBeforeCreate = async (data) => {
  return await BOOKING_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (reqData) => {
  try {
    const validData = await validateBeforeCreate(reqData);

    const createdBooking = await GET_DB()
      .collection(BOOKING_COLLECTION_NAME)
      .insertOne(validData);

    return createdBooking;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const foundBooking = await GET_DB()
      .collection(BOOKING_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(String(id)),
      });

    return foundBooking;
  } catch (error) {
    throw new Error(error);
  }
};

const getDetails = async (bookingId) => {
  try {
    const queryConditions = [
      {
        _id: new ObjectId(String(bookingId)),
      },
    ];

    const foundBooking = await GET_DB()
      .collection(BOOKING_COLLECTION_NAME)
      .aggregate([{ $match: { $and: queryConditions } }])
      .toArray();

    return foundBooking[0] || null;
  } catch (error) {
    throw new Error(error);
  }
};

const getListBookings = async (page, itemsPerPage, queryFilter) => {
  try {
    const queryCondition = [
      {
        _destroy: false,
      },
    ];

    if (queryFilter) {
      Object.keys(queryFilter).forEach((key) => {
        queryCondition.push({
          [key]: { $regex: new RegExp(queryFilter[key], "i") },
        });
      });
    }

    const query = await GET_DB()
      .collection(BOOKING_COLLECTION_NAME)
      .aggregate(
        [
          { $match: { $and: queryCondition } },
          {
            $facet: {
              queryBookings: [
                { $skip: pagingSkipValue(page, itemsPerPage) },
                { $limit: itemsPerPage },
              ],
              queryTotalBookings: [{ $count: "countedAllBookings" }],
            },
          },
        ],
        {
          collation: { locale: "en" },
        }
      )
      .toArray();

    const res = query[0];

    return {
      bookings: res.queryBookings || [],
      totalBookings: res.queryTotalBookings[0]?.countedAllBookings || 0,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (bookingId, updateData) => {
  try {
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    const result = await GET_DB()
      .collection(BOOKING_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(String(bookingId)),
        },
        {
          $set: updateData,
        },
        {
          returnDocument: "after",
        }
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteOne = async (bookingId) => {
  try {
    const deletedBooking = await GET_DB()
      .collection(BOOKING_COLLECTION_NAME)
      .deleteOne({
        _id: new ObjectId(String(bookingId)),
      });

    return deletedBooking;
  } catch (error) {
    throw new Error(error);
  }
};

export const bookingModel = {
  BOOKING_COLLECTION_NAME,
  BOOKING_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  getListBookings,
  update,
  deleteOne,
};
