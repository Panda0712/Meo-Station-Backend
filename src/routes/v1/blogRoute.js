import express from "express";
import { blogController } from "~/controllers/blogController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { multerUploadMiddleware } from "~/middlewares/multerUploadMiddleware";
import { blogValidation } from "~/validations/blogValidation";

const Router = express.Router();

Router.route("/")
  .get(authMiddleware.isAuthorized, blogController.getListBlogs)
  .post(
    authMiddleware.isAuthorized,
    blogValidation.createNew,
    blogController.createNew
  );

Router.route("/:blogId")
  .get(
    authMiddleware.isAuthorized,
    blogValidation.getDetails,
    blogController.getDetails
  )
  .put(
    authMiddleware.isAuthorized,
    blogValidation.update,
    blogController.update
  )
  .delete(
    authMiddleware.isAuthorized,
    blogValidation.deleteBlog,
    blogController.deleteBlog
  );

Router.route("/uploads").post(
  authMiddleware.isAuthorized,
  multerUploadMiddleware.upload.single("blog-covers"),
  blogController.uploadsBlogCover
);

export const blogRoute = Router;
