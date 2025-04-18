import { hotelModel } from "~/models/hotelModel";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from "~/utils/constants";

const createNew = async (reqBody) => {
  try {
    const createdHotel = await hotelModel.createNew(reqBody);

    const getNewHotel = await hotelModel.findOneById(createdHotel.insertedId);

    return getNewHotel;
  } catch (error) {
    throw error;
  }
};

const getListHotels = async (page, itemsPerPage, queryFilter) => {
  try {
    if (!page) page = DEFAULT_PAGE;
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE;

    const results = await hotelModel.getListHotels(
      parseInt(page, 10),
      parseInt(itemsPerPage, 10),
      queryFilter
    );

    return results;
  } catch (error) {
    throw error;
  }
};

const update = async (hotelId, updateData) => {
  try {
    const updatedHotel = await hotelModel.update(hotelId, updateData);

    return updatedHotel;
  } catch (error) {
    throw error;
  }
};

const deleteHotel = async (hotelId) => {
  try {
    const deletedHotel = await hotelModel.deleteHotel(hotelId);

    return deletedHotel;
  } catch (error) {
    throw error;
  }
};

export const hotelService = { createNew, getListHotels, update, deleteHotel };
