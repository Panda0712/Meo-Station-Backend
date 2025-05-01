import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { bookingModel } from "~/models/bookingModel";
import { pagingSkipValue } from "~/utils/algorithms";

const HOTEL_COLLECTION_NAME = "hotels";
const HOTEL_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(5).max(50).trim().strict(),
  location: Joi.string().required().min(5).max(80).trim().strict(),
  images: Joi.array().items(Joi.string().required()).max(3),
  description: Joi.string().required().min(5).max(350).trim().strict(),
  utilities: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().required().trim().strict(),
        value: Joi.string().required().trim().strict(),
      })
    )
    .max(8),
  maxGuest: Joi.number().required().min(1).max(8),
  pricePerNight: Joi.number().required().min(150000).max(1000000),
  priceFirstHour: Joi.number().required().min(50000).max(300000),
  priceEachHour: Joi.number().required().min(70000).max(300000),
  discount: Joi.number().required().min(10000),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const INVALID_UPDATE_FIELDS = ["_id", "createdAt"];

const validateBeforeCreate = async (data) => {
  return await HOTEL_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (reqBody) => {
  try {
    const validData = await validateBeforeCreate(reqBody);

    const createdHotel = await GET_DB()
      .collection(HOTEL_COLLECTION_NAME)
      .insertOne(validData);

    return createdHotel;
  } catch (error) {
    throw new Error(error);
  }
};

const getDetails = async (hotelId) => {
  try {
    const queryConditions = [
      {
        _id: new ObjectId(String(hotelId)),
      },
    ];

    const foundHotel = await GET_DB()
      .collection(HOTEL_COLLECTION_NAME)
      .aggregate([{ $match: { $and: queryConditions } }])
      .toArray();

    return foundHotel[0] || null;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const foundHotel = await GET_DB()
      .collection(HOTEL_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(String(id)),
      });

    return foundHotel;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneByName = async (name) => {
  try {
    const foundHotel = await GET_DB()
      .collection(HOTEL_COLLECTION_NAME)
      .findOne({
        title: String(name),
      });

    return foundHotel;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (hotelId, updateData) => {
  try {
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    const result = await GET_DB()
      .collection(HOTEL_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(String(hotelId)),
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

const getSearchHotels = async (
  checkInDate,
  checkOutDate,
  guest,
  queryFilter
) => {
  try {
    const bookings = await bookingModel.getAllBookings();

    const listTimeBookings = bookings?.map((booking) => ({
      hotelId: booking.hotelId,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
    }));

    const disabledHotel = listTimeBookings
      .map((booking) =>
        new Date(checkInDate) <= new Date(booking.checkOutDate) &&
        new Date(checkOutDate) >= new Date(booking.checkInDate)
          ? booking.hotelId
          : null
      )
      .filter(Boolean);

    const queryConditions = [
      {
        _destroy: false,
        maxGuest: { $gte: guest },
        _id: { $nin: disabledHotel.map((id) => new ObjectId(String(id))) },
      },
    ];

    if (queryFilter) {
      Object.keys(queryFilter).forEach((key) => {
        queryConditions.push({
          [key]: { $regex: new RegExp(queryFilter[key], "i") },
        });
      });
    }

    const hotels = await GET_DB()
      .collection(HOTEL_COLLECTION_NAME)
      .find({ $and: queryConditions })
      .toArray();

    return hotels;
  } catch (error) {
    throw new Error(error);
  }
};

const getListHotels = async (page, itemsPerPage, queryFilter) => {
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
      .collection(HOTEL_COLLECTION_NAME)
      .aggregate(
        [
          { $match: { $and: queryCondition } },
          { $sort: { title: 1 } },
          {
            $facet: {
              queryHotels: [
                { $skip: pagingSkipValue(page, itemsPerPage) },
                { $limit: itemsPerPage },
              ],
              queryTotalHotels: [{ $count: "countedAllHotels" }],
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
      hotels: res.queryHotels || [],
      totalHotels: res.queryTotalHotels[0]?.countedAllHotels || 0,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const deleteHotel = async (hotelId) => {
  try {
    const deletedHotel = await GET_DB()
      .collection(HOTEL_COLLECTION_NAME)
      .deleteOne({
        _id: new ObjectId(String(hotelId)),
      });

    return deletedHotel;
  } catch (error) {
    throw new Error(error);
  }
};

export const hotelModel = {
  HOTEL_COLLECTION_NAME,
  HOTEL_COLLECTION_SCHEMA,
  createNew,
  getDetails,
  findOneById,
  findOneByName,
  update,
  getSearchHotels,
  getListHotels,
  deleteHotel,
};
