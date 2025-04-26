import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "~/utils/ApiError";
import { BOOKING_MODE, PAYMENT_METHODS } from "~/utils/constants";
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  PHONE_RULE,
  PHONE_RULE_MESSAGE,
} from "~/utils/validators";

const createPayment = async (req, res, next) => {
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
    numberOfNights: Joi.number().optional(),
    guest: Joi.number().required(),
    paymentMethod: Joi.string()
      .required()
      .valid(
        PAYMENT_METHODS.CASH,
        PAYMENT_METHODS.MOMO,
        PAYMENT_METHODS.ZALOPAY
      ),
    totalPrice: Joi.number().required(),
    note: Joi.string().allow("").optional(),
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

const callbackPayment = async (req, res, next) => {
  const correctCondition = Joi.object({
    data: Joi.string().required(),
    mac: Joi.string().required(),
    type: Joi.number().optional(),
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

export const zalopayValidation = { createPayment, callbackPayment };
