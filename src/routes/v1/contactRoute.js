import express from "express";
import { contactController } from "~/controllers/contactController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { contactValidation } from "~/validations/contactValidation";

const Router = express.Router();

Router.route("/")
  .get(authMiddleware.isAuthorized, contactController.getListContacts)
  .post(
    authMiddleware.isAuthorized,
    contactValidation.createNew,
    contactController.createNew
  );

Router.route("/:contactId").delete(
  authMiddleware.isAuthorized,
  contactValidation.deleteContact,
  contactController.deleteContact
);

export const contactRoute = Router;
