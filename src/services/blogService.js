import { blogModel } from "~/models/blogModel";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from "~/utils/constants";

const createNew = async (reqData) => {
  try {
    const createdBlog = await blogModel.createNew(reqData);

    const getNewBlog = await blogModel.findOneById(createdBlog.insertedId);

    return getNewBlog;
  } catch (error) {
    throw error;
  }
};

const getListBlogs = async (page, itemsPerPage, queryFilter) => {
  try {
    if (!page) page = DEFAULT_PAGE;
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE;

    const results = await blogModel.getListBlogs(
      parseInt(page, 10),
      parseInt(itemsPerPage, 10),
      queryFilter
    );
    return results;
  } catch (error) {
    throw error;
  }
};

const getDetails = async (blogId) => {
  try {
    const result = await blogModel.getDetails(blogId);

    return result;
  } catch (error) {
    throw error;
  }
};

const update = async (blogId, updateData) => {
  try {
    const updatedBlog = await blogModel.update(blogId, updateData);

    return updatedBlog;
  } catch (error) {
    throw error;
  }
};

const deleteBlog = async (blogId) => {
  try {
    const deletedBlog = await blogModel.deleteBlog(blogId);

    return deletedBlog;
  } catch (error) {
    throw error;
  }
};

export const blogService = {
  createNew,
  getListBlogs,
  getDetails,
  update,
  deleteBlog,
};
