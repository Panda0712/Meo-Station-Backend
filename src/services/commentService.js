import { commentModel } from "~/models/commentModel";

const createNew = async (reqData) => {
  try {
    const createdComment = await commentModel.createNew(reqData);

    const getNewComment = await commentModel.findOneById(
      createdComment.insertedId
    );

    return getNewComment;
  } catch (error) {
    throw error;
  }
};

const getAllComments = async (hotelId) => {
  try {
    const getComments = await commentModel.getAllComments(hotelId);

    return getComments;
  } catch (error) {
    throw error;
  }
};

const update = async (commentId, updateData) => {
  try {
    const updatedComment = await commentModel.update(commentId, updateData);

    return updatedComment;
  } catch (error) {
    throw error;
  }
};

const deleteComment = async (commentId) => {
  try {
    const deletedComment = await commentModel.deleteComment(commentId);

    return deletedComment;
  } catch (error) {
    throw error;
  }
};

export const commentService = {
  createNew,
  getAllComments,
  update,
  deleteComment,
};
