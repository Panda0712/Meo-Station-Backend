import { StatusCodes } from "http-status-codes";
import { CloudinaryProvider } from "~/providers/CloudinaryProvider";
import { hotelService } from "~/services/hotelService";

const createNew = async (req, res, next) => {
  try {
    const createdHotel = await hotelService.createNew(req.body);

    res.status(StatusCodes.CREATED).json(createdHotel);
  } catch (error) {
    next(error);
  }
};

const uploadImages = async (req, res, next) => {
  try {
    const hotelImagesList = req.files;

    const uploadImagesFile = await Promise.all(
      hotelImagesList.map((image) =>
        CloudinaryProvider.streamUpload(image.buffer, "hotel-images")
      )
    );

    return res.status(StatusCodes.CREATED).json(uploadImagesFile);
  } catch (error) {
    next(error);
  }
};

const getListHotels = async (req, res, next) => {
  try {
    const { page, itemsPerPage, q } = req.query;
    const queryFilter = q;

    const results = await hotelService.getListHotels(
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
    const hotelId = req.params.hotelId;

    const updatedHotel = await hotelService.update(hotelId, req.body);

    res.status(StatusCodes.OK).json(updatedHotel);
  } catch (error) {
    next(error);
  }
};

const deleteHotel = async (req, res, next) => {
  try {
    const hotelId = req.params.hotelId;

    const deletedHotel = await hotelService.deleteHotel(hotelId);

    res.status(StatusCodes.OK).json(deletedHotel);
  } catch (error) {
    next(error);
  }
};

export const hotelController = {
  createNew,
  uploadImages,
  getListHotels,
  update,
  deleteHotel,
};
