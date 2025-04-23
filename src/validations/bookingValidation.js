import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "~/utils/ApiError";
import { BOOKING_MODE, BOOKING_STATUS } from "~/utils/constants";
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  PHONE_RULE,
  PHONE_RULE_MESSAGE,
} from "~/utils/validators";

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
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
    mode: Joi.string().required().valid(BOOKING_MODE.night, BOOKING_MODE.day),
    checkInDate: Joi.string().isoDate().required(),
    checkOutDate: Joi.string().isoDate().required(),
    numberOfNights: Joi.number().required(),
    guest: Joi.number().required(),
    status: Joi.string()
      .required()
      .valid(
        BOOKING_STATUS.CANCELLED,
        BOOKING_STATUS.PENDING,
        BOOKING_STATUS.COMPLETED
      ),
    totalPrice: Joi.number().required(),
    note: Joi.string(),
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
    bookingId: Joi.string()
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
    userName: Joi.string().min(5).trim().strict(),
    hotelImages: Joi.array().items(Joi.string()).length(3),
    hotelLocation: Joi.string().min(10).trim().strict(),
    hotelName: Joi.string().min(5).trim().strict(),
    mode: Joi.string().valid(BOOKING_MODE.night, BOOKING_MODE.day),
    checkInDate: Joi.string().isoDate(),
    checkOutDate: Joi.string().isoDate(),
    numberOfNights: Joi.number(),
    guest: Joi.number(),
    totalPrice: Joi.number(),
    note: Joi.string(),
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

const deleteOne = async (req, res, next) => {
  const correctCondition = Joi.object({
    bookingId: Joi.string()
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

export const bookingValidation = {
  createNew,
  getDetails,
  update,
  deleteOne,
};
