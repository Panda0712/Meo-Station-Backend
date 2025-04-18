import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { pagingSkipValue } from "~/utils/algorithms";
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from "~/utils/validators";

const CONTACT_COLLECTION_NAME = "contacts";
const CONTACT_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(5).max(80).trim().strict(),
  email: Joi.string()
    .required()
    .pattern(EMAIL_RULE)
    .message(EMAIL_RULE_MESSAGE),
  phone: Joi.string().required().min(9).max(11).trim().strict(),
  message: Joi.string().required().min(10).max(200).trim().strict(),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const validateBeforeCreate = async (data) => {
  return await CONTACT_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);

    const createdContact = await GET_DB()
      .collection(CONTACT_COLLECTION_NAME)
      .insertOne(validData);

    return createdContact;
  } catch (error) {
    throw new Error(error);
  }
};

const getListContacts = async (page, itemsPerPage, queryFilter) => {
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
      .collection(CONTACT_COLLECTION_NAME)
      .aggregate(
        [
          { $match: { $and: queryCondition } },
          { $sort: { name: 1 } },
          {
            $facet: {
              queryContacts: [
                { $skip: pagingSkipValue(page, itemsPerPage) },
                { $limit: itemsPerPage },
              ],
              queryTotalContacts: [{ $count: "countedAllContacts" }],
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
      contacts: res.queryContacts || [],
      totalContacts: res.queryTotalContacts[0]?.countedAllContacts || 0,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const deleteContact = async (contactId) => {
  try {
    const deletedContact = await GET_DB()
      .collection(CONTACT_COLLECTION_NAME)
      .deleteOne({
        _id: new ObjectId(String(contactId)),
      });

    return deletedContact;
  } catch (error) {
    throw new Error(error);
  }
};

export const contactModel = {
  createNew,
  getListContacts,
  deleteContact,
};
