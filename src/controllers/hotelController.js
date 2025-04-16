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

const deleteHotel = async (req, res, next) => {};

export const hotelController = { createNew, uploadImages, deleteHotel };
