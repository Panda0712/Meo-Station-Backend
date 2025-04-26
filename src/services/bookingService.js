import { bookingModel } from "~/models/bookingModel";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from "~/utils/constants";

const createNew = async (reqData) => {
  try {
    const createdBooking = await bookingModel.createNew(reqData);

    const getNewBooking = await bookingModel.findOneById(
      createdBooking.insertedId
    );

    return getNewBooking;
  } catch (error) {
    throw error;
  }
};

const getBookingsByUser = async (userId) => {
  try {
    const results = await bookingModel.getBookingsByUser(userId);

    return results;
  } catch (error) {
    throw error;
  }
};

const getDetails = async (bookingId) => {
  try {
    const foundBooking = await bookingModel.getDetails(bookingId);
    if (!foundBooking) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Không tìm thấy đơn đặt phòng tương ứng!! Vui lòng thử lại sau!!"
      );
    }

    return foundBooking;
  } catch (error) {
    throw error;
  }
};

const getListBookings = async (page, itemsPerPage, queryFilter) => {
  try {
    if (!page) page = DEFAULT_PAGE;
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE;

    const results = await bookingModel.getListBookings(
      parseInt(page, 10),
      parseInt(itemsPerPage, 10),
      queryFilter
    );

    return results;
  } catch (error) {
    throw error;
  }
};

const update = async (bookingId, reqData) => {
  try {
    const updatedBooking = await bookingModel.update(bookingId, reqData);

    return updatedBooking;
  } catch (error) {
    throw error;
  }
};

const deleteOne = async (bookingId) => {
  try {
    const deletedBooking = await bookingModel.deleteOne(bookingId);

    return deletedBooking;
  } catch (error) {
    throw error;
  }
};

export const bookingService = {
  createNew,
  getDetails,
  getBookingsByUser,
  getListBookings,
  update,
  deleteOne,
};
