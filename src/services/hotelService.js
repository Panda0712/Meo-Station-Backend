import { hotelModel } from "~/models/hotelModel";

const createNew = async (reqBody) => {
  try {
    const createdHotel = await hotelModel.createNew(reqBody);

    return createdHotel;
  } catch (error) {
    throw error;
  }
};

export const hotelService = { createNew };
