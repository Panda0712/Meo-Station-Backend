import express from "express";
import { hotelController } from "~/controllers/hotelController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { multerUploadMiddleware } from "~/middlewares/multerUploadMiddleware";
import { hotelValidation } from "~/validations/hotelValidation";

const Router = express.Router();

Router.route("/")
  .get(authMiddleware.isAuthorized, hotelController.getListHotels)
  .post(
    authMiddleware.isAuthorized,
    hotelValidation.createNew,
    hotelController.createNew
  );

Router.route("/:hotelId")
  .put(
    authMiddleware.isAuthorized,
    hotelValidation.update,
    hotelController.update
  )
  .delete(
    authMiddleware.isAuthorized,
    hotelValidation.deleteHotel,
    hotelController.deleteHotel
  );

Router.route("/uploads").post(
  authMiddleware.isAuthorized,
  multerUploadMiddleware.upload.array("hotel-images", 3),
  hotelController.uploadImages
);

export const hotelRoute = Router;
