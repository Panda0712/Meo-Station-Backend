import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";

const COMMENT_COLLECTION_NAME = "comments";
const COMMENT_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  hotelId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  userName: Joi.string().required(),
  avatar: Joi.string().required(),
  rating: Joi.number().required(),
  comment: Joi.string().required(),

  commentedAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const INVALID_UPDATE_FIELDS = ["_id", "hotelId", "userId"];

const validateBeforeCreate = async (data) => {
  return await COMMENT_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (reqData) => {
  try {
    const validData = await validateBeforeCreate(reqData);

    const createdComment = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .insertOne(validData);

    return createdComment;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllComments = async (hotelId) => {
  try {
    const queryConditions = [
      {
        hotelId: new ObjectId(String(hotelId)),
      },
      {
        _destroy: false,
      },
    ];

    const results = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .aggregate([{ $match: { $and: queryConditions } }])
      .toArray();

    return results;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const foundComment = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(String(id)),
      });

    return foundComment;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (commentId, updateData) => {
  try {
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    const result = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(String(commentId)),
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

const deleteComment = async (commentId) => {
  try {
    const deletedComment = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .deleteOne({
        _id: new ObjectId(String(commentId)),
      });

    return deletedComment;
  } catch (error) {
    throw new Error(error);
  }
};

export const commentModel = {
  COMMENT_COLLECTION_NAME,
  COMMENT_COLLECTION_SCHEMA,
  createNew,
  getAllComments,
  findOneById,
  update,
  deleteComment,
};
