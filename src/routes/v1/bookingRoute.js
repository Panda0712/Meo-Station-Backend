import express from "express";
import { bookingController } from "~/controllers/bookingController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { bookingValidation } from "~/validations/bookingValidation";

const Router = express.Router();

Router.route("/")
  .post(
    authMiddleware.isAuthorized,
    bookingValidation.createNew,
    bookingController.createNew
  )
  .get(authMiddleware.isAuthorized, bookingController.getListBookings);

Router.route("/history").get(
  authMiddleware.isAuthorized,
  bookingController.getBookingsByUser
);

Router.route("/:bookingId")
  .put(
    authMiddleware.isAuthorized,
    bookingValidation.update,
    bookingController.update
  )
  .get(
    authMiddleware.isAuthorized,
    bookingValidation.getDetails,
    bookingController.getDetails
  )
  .delete(
    authMiddleware.isAuthorized,
    bookingValidation.deleteOne,
    bookingController.deleteOne
  );

export const bookingRoute = Router;
