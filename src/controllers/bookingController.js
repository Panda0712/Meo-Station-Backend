import { StatusCodes } from "http-status-codes";
import { bookingService } from "~/services/bookingService";

const createNew = async (req, res, next) => {
  try {
    const createdBooking = await bookingService.createNew(req.body);

    res.status(StatusCodes.CREATED).json(createdBooking);
  } catch (error) {
    next(error);
  }
};

const getDetails = async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;

    const foundBooking = await bookingService.getDetails(bookingId);

    res.status(StatusCodes.OK).json(foundBooking);
  } catch (error) {
    next(error);
  }
};

const getListBookings = async (req, res, next) => {
  try {
    const { page, itemsPerPage, q } = req.query;
    const queryFilter = q;

    const results = await bookingService.getListBookings(
      page,
      itemsPerPage,
      queryFilter
    );

    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;
    const updatedBooking = await bookingService.update(bookingId, req.body);

    res.status(StatusCodes.OK).json(updatedBooking);
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;
    const deletedBooking = await bookingService.deleteOne(bookingId);

    res.status(StatusCodes.OK).json(deletedBooking);
  } catch (error) {
    next(error);
  }
};

export const bookingController = {
  createNew,
  getDetails,
  getListBookings,
  update,
  deleteOne,
};
