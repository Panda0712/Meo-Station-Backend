import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "~/utils/ApiError";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().min(5).max(80).trim().strict(),
    discount: Joi.number().required().min(0).max(100).strict(),
    hotelIds: Joi.alternatives()
      .try(
        Joi.string()
          .required()
          .pattern(OBJECT_ID_RULE)
          .message(OBJECT_ID_RULE_MESSAGE),
        Joi.array().items(
          Joi.string()
            .required()
            .pattern(OBJECT_ID_RULE)
            .message(OBJECT_ID_RULE_MESSAGE)
        )
      )
      .required(),
    code: Joi.string().required().min(5).max(10).trim().strict(),
    usageLimit: Joi.number().integer().min(1).default(1),
    usedCount: Joi.number().integer().min(0).default(0),

    minOrderValue: Joi.number().min(0).default(0),
    expiredAt: Joi.date().timestamp("javascript").default(null),
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

const checkVoucher = async (req, res, next) => {
  const correctCondition = Joi.object({
    code: Joi.string().required().min(5).max(10).trim().strict(),
    hotelId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
  });

  try {
    await correctCondition.validateAsync(req.query, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

const getVoucherById = async (req, res, next) => {
  const correctCondition = Joi.object({
    voucherId: Joi.string()
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
    name: Joi.string().min(5).max(80).trim().strict(),
    discount: Joi.number().min(0).max(100).strict(),
    hotelIds: Joi.alternatives().try(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
      Joi.array().items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      )
    ),
    code: Joi.string().min(5).max(10).trim().strict(),
    usageLimit: Joi.number().integer().min(1).default(1),
    usedCount: Joi.number().integer().min(0).default(0),

    minOrderValue: Joi.number().min(0).default(0),
    expiredAt: Joi.date().timestamp("javascript").default(null),
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

const deleteVoucher = async (req, res, next) => {
  const correctCondition = Joi.object({
    voucherId: Joi.string()
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

export const voucherValidation = {
  createNew,
  checkVoucher,
  getVoucherById,
  update,
  deleteVoucher,
};
