import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "~/utils/ApiError";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(5).max(200).trim().strict(),
    content: Joi.string().required().min(10).trim().strict(),
    summary: Joi.string().required().min(10).max(300).trim().strict(),
    coverImage: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).default([]),
    author: Joi.string().required(),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

const getDetails = async (req, res, next) => {
  const correctCondition = Joi.object({
    blogId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
  });

  try {
    await correctCondition.validateAsync(req.params, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(5).max(200).trim().strict(),
    content: Joi.string().min(10).trim().strict(),
    summary: Joi.string().min(10).max(300).trim().strict(),
    coverImage: Joi.string(),
    tags: Joi.array().items(Joi.string()).default([]),
    author: Joi.string(),
  });

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

const deleteBlog = async (req, res, next) => {
  const correctCondition = Joi.object({
    blogId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
  });

  try {
    await correctCondition.validateAsync(req.params, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

export const blogValidation = { createNew, getDetails, update, deleteBlog };
