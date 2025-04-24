import express from "express";
import { momoController } from "~/controllers/momoController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { momoValidation } from "~/validations/momoValidation";

const Router = express.Router();

Router.route("/").post(
  authMiddleware.isAuthorized,
  momoValidation.createPayment,
  momoController.createPayment
);

Router.route("/callback").post(
  momoValidation.callbackPayment,
  momoController.callbackPayment
);

Router.route("/transaction-status").post(
  authMiddleware.isAuthorized,
  momoValidation.checkTransactionStatus,
  momoController.checkTransactionStatus
);

export const momoRoute = Router;
