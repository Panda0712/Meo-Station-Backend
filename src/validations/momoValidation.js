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
    numberOfNights: Joi.number().required(),
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
  console.log(req.body);
  const correctCondition = Joi.object({
    partnerCode: Joi.string().required(),
    orderId: Joi.string().required(),
    requestId: Joi.string().required(),
    amount: Joi.number().required(),
    orderInfo: Joi.string().required(),
    orderType: Joi.string().required(),
    transId: Joi.number().required(),
    resultCode: Joi.number().required(),
    message: Joi.string().required(),
    payType: Joi.string().required(),
    responseTime: Joi.number().required(),
    extraData: Joi.string().required(),
    signature: Joi.string().required(),
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

const checkTransactionStatus = async (req, res, next) => {
  const correctCondition = Joi.object({
    orderId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
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

export const momoValidation = {
  createPayment,
  callbackPayment,
  checkTransactionStatus,
};
