import express from "express";
import { notificationController } from "~/controllers/notificationController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { notificationValidation } from "~/validations/notificationValidation";

const Router = express.Router();

Router.route("/")
  .post(
    authMiddleware.isAuthorized,
    notificationValidation.createNew,
    notificationController.createNew
  )
  .get(authMiddleware.isAuthorized, notificationController.getNotifications);

Router.route("/:notificationId")
  .put(
    authMiddleware.isAuthorized,
    notificationValidation.updateNotification,
    notificationController.updateNotification
  )
  .delete(
    authMiddleware.isAuthorized,
    notificationValidation.deleteNotification,
    notificationController.deleteNotification
  );

export const notificationRoute = Router;
