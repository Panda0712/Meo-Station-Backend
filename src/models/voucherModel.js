import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { pagingSkipValue } from "~/utils/algorithms";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const VOUCHER_COLLECTION_NAME = "vouchers";
const VOUCHER_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(5).max(80).trim().strict(),
  discount: Joi.number().required().min(0).max(100).strict(),
  hotelIds: Joi.alternatives()
    .try(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
      Joi.array().items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      )
    )
    .required(),
  code: Joi.string().required().min(5).max(10).trim().strict(),
  usageLimit: Joi.number().integer().min(1).default(1),
  usedCount: Joi.number().integer().min(0).default(0),

  minOrderValue: Joi.number().min(0).default(0),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  expiredAt: Joi.date().timestamp("javascript").default(null),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const INVALID_UPDATE_FIELDS = ["_id", "createdAt"];

const validateBeforeCreate = async (data) => {
  return await VOUCHER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);

    const createdVoucher = await GET_DB()
      .collection(VOUCHER_COLLECTION_NAME)
      .insertOne(validData);

    return createdVoucher;
  } catch (error) {
    throw new Error(error);
  }
};

const getVouchers = async (page, itemsPerPage, queryFilter) => {
  try {
    const queryConditions = [
      {
        _destroy: false,
      },
    ];

    if (queryFilter) {
      Object.keys(queryFilter).forEach((key) => {
        queryConditions.push({
          [key]: { $regex: new RegExp(queryFilter[key], "i") },
        });
      });
    }

    const query = await GET_DB()
      .collection(VOUCHER_COLLECTION_NAME)
      .aggregate(
        [
          { $match: { $and: queryConditions } },
          { $sort: { name: 1 } },
          {
            $facet: {
              queryVouchers: [
                { $skip: pagingSkipValue(page, itemsPerPage) },
                { $limit: Number(itemsPerPage) },
              ],
              queryTotalVouchers: [{ $count: "countedAllVouchers" }],
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
      vouchers: res.queryVouchers || [],
      totalVouchers: res.queryTotalVouchers[0]?.countedAllVouchers || 0,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const getVoucherById = async (voucherId) => {
  try {
    const foundVoucher = await GET_DB()
      .collection(VOUCHER_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(String(voucherId)),
      });

    return foundVoucher;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (voucherId, updateData) => {
  try {
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName))
        delete updateData[fieldName];
    });

    const result = await GET_DB()
      .collection(VOUCHER_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(String(voucherId)),
        },
        {
          $set: {
            ...updateData,
            updatedAt: Date.now(),
          },
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

const deleteVoucher = async (voucherId) => {
  try {
    const deletedVoucher = await GET_DB()
      .collection(VOUCHER_COLLECTION_NAME)
      .deleteOne({
        _id: new ObjectId(String(voucherId)),
      });

    return deletedVoucher;
  } catch (error) {
    throw new Error(error);
  }
};

export const voucherModel = {
  VOUCHER_COLLECTION_NAME,
  VOUCHER_COLLECTION_SCHEMA,
  createNew,
  getVouchers,
  getVoucherById,
  update,
  deleteVoucher,
};
