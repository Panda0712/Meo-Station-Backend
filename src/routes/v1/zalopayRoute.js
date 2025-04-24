import express from "express";
import { zalopayController } from "~/controllers/zalopayController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { zalopayValidation } from "~/validations/zalopayValidation";

const Router = express.Router();

Router.route("/").post(
  authMiddleware.isAuthorized,
  zalopayValidation.createPayment,
  zalopayController.createPayment
);

Router.route("/callback").post(
  zalopayValidation.callbackPayment,
  zalopayController.callbackPayment
);

export const zalopayRoute = Router;
