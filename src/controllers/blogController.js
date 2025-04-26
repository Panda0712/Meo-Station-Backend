import { StatusCodes } from "http-status-codes";
import { CloudinaryProvider } from "~/providers/CloudinaryProvider";
import { blogService } from "~/services/blogService";

const createNew = async (req, res, next) => {
  try {
    const createData = {
      ...req.body,
      authorId: req.jwtDecoded._id,
      author: req.body.author || req.jwtDecoded.email,
    };

    const createdBlog = await blogService.createNew(createData);

    res.status(StatusCodes.CREATED).json(createdBlog);
  } catch (error) {
    next(error);
  }
};

const getListBlogs = async (req, res, next) => {
  try {
    const { page, itemsPerPage, q } = req.query;
    const queryFilter = q;

    const results = await blogService.getListBlogs(
      page,
      itemsPerPage,
      queryFilter
    );
    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(error);
  }
};

const getDetails = async (req, res, next) => {
  try {
    const blogId = req.params.blogId;

    const result = await blogService.getDetails(blogId);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const blogId = req.params.blogId;

    const updatedBlog = await blogService.update(blogId, req.body);

    res.status(StatusCodes.OK).json(updatedBlog);
  } catch (error) {
    next(error);
  }
};

const uploadsBlogCover = async (req, res, next) => {
  try {
    const blogCoverImage = req.file;

    const uploadImageFile = await CloudinaryProvider.streamUpload(
      blogCoverImage.buffer,
      "blog-covers"
    );

    res.status(StatusCodes.CREATED).json(uploadImageFile);
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blogId = req.params.blogId;

    const deletedBlog = await blogService.deleteBlog(blogId);

    res.status(StatusCodes.OK).json(deletedBlog);
  } catch (error) {
    next(error);
  }
};

export const blogController = {
  createNew,
  getListBlogs,
  getDetails,
  update,
  uploadsBlogCover,
  deleteBlog,
};
