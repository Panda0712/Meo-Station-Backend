import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const BLOG_COLLECTION_NAME = "blogs";
const BLOG_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(5).max(200).trim().strict(),
  content: Joi.string().required().min(10).trim().strict(),
  summary: Joi.string().required().min(10).max(300).trim().strict(),
  coverImage: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).default([]),
  author: Joi.string().required(),
  authorId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const INVALID_UPDATE_FIELDS = ["_id", "authorId", "createdAt"];

const validateBeforeCreate = async (data) => {
  return await BLOG_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (reqData) => {
  try {
    const validData = await validateBeforeCreate({
      ...reqData,
      authorId: String(reqData.authorId),
    });

    validData.authorId = new ObjectId(String(validData.authorId));

    const createdBlog = await GET_DB()
      .collection(BLOG_COLLECTION_NAME)
      .insertOne(validData);
    return createdBlog;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const foundBlog = await GET_DB()
      .collection(BLOG_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(String(id)),
      });
    return foundBlog;
  } catch (error) {
    throw new Error(error);
  }
};

const getListBlogs = async (page, itemsPerPage, queryFilter) => {
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
      .collection(BLOG_COLLECTION_NAME)
      .aggregate(
        [
          { $match: { $and: queryCondition } },
          {
            $facet: {
              queryBlogs: [
                { $skip: pagingSkipValue(page, itemsPerPage) },
                { $limit: itemsPerPage },
              ],
              queryTotalBlogs: [{ $count: "countedAllBlogs" }],
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
      blogs: res.queryBlogs || [],
      totalBlogs: res.queryTotalBlogs[0]?.countedAllBlogs || 0,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const getDetails = async (blogId) => {
  try {
    const queryConditions = [
      {
        _id: new ObjectId(String(blogId)),
      },
    ];

    const foundBlog = await GET_DB()
      .collection(BLOG_COLLECTION_NAME)
      .aggregate([{ $match: { $and: queryConditions } }])
      .toArray();

    return foundBlog;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (blogId, updateData) => {
  try {
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    const result = await GET_DB()
      .collection(BLOG_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(String(blogId)),
        },
        {
          $set: { ...updateData, updatedAt: Date.now() },
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

const deleteBlog = async (blogId) => {
  try {
    const deletedBlog = await GET_DB()
      .collection(BLOG_COLLECTION_NAME)
      .deleteOne({
        _id: new ObjectId(String(blogId)),
      });
    return deletedBlog;
  } catch (error) {
    throw new Error(error);
  }
};

export const blogModel = {
  BLOG_COLLECTION_NAME,
  BLOG_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getListBlogs,
  getDetails,
  update,
  deleteBlog,
};
