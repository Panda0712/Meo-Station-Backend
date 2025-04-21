import express from "express";
import { commentController } from "~/controllers/commentController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { commentValidation } from "~/validations/commentValidation";

const Router = express.Router();

Router.route("/")
  .post(
    authMiddleware.isAuthorized,
    commentValidation.createNew,
    commentController.createNew
  )
  .get(
    authMiddleware.isAuthorized,
    commentValidation.getAllComments,
    commentController.getAllComments
  );

Router.route("/:commentId")
  .put(
    authMiddleware.isAuthorized,
    commentValidation.update,
    commentController.update
  )
  .delete(
    authMiddleware.isAuthorized,
    commentValidation.deleteComment,
    commentController.deleteComment
  );

export const commentRoute = Router;
