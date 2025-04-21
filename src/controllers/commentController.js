import { StatusCodes } from "http-status-codes";
import { commentService } from "~/services/commentService";

const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;

    const createData = {
      ...req.body,
      userId,
    };

    const createdComment = await commentService.createNew(createData);

    res.status(StatusCodes.CREATED).json(createdComment);
  } catch (error) {
    next(error);
  }
};

const getAllComments = async (req, res, next) => {
  try {
    const hotelId = req.body.hotelId;
    const results = await commentService.getAllComments(hotelId);

    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;

    const updatedComment = await commentService.update(commentId, req.body);

    res.status(StatusCodes.OK).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;

    const deletedComment = await commentService.deleteComment(commentId);

    res.status(StatusCodes.OK).json(deletedComment);
  } catch (error) {
    next(error);
  }
};

export const commentController = {
  createNew,
  getAllComments,
  update,
  deleteComment,
};
