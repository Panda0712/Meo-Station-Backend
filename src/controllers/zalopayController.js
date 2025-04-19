import { StatusCodes } from "http-status-codes";
import { zalopayService } from "~/services/zalopayService";

const createPayment = async (req, res, next) => {
  try {
    const result = await zalopayService.createPayment(req.body);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const callbackPayment = async (req, res, next) => {
  try {
    const result = await zalopayService.callbackPayment(req.body);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const zalopayController = { createPayment, callbackPayment };
