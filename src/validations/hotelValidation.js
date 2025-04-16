import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "~/utils/ApiError";

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(5).max(50).trim().strict(),
    location: Joi.string().required().min(5).max(80).trim().strict(),
    images: Joi.array().items(Joi.string()).max(3),
    description: Joi.string().required().min(5).max(150).trim().strict(),
    utilities: Joi.array().items(Joi.string().required()).max(8),
    maxGuest: Joi.number().required().min(1).max(8),
    pricePerNight: Joi.number().required().min(150000).max(1000000),
    priceFirstHour: Joi.number().required().min(50000).max(300000),
    priceEachHour: Joi.number().required().min(70000).max(300000),
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

const deleteHotel = async (req, res, next) => {};

export const hotelValidation = { createNew, deleteHotel };
