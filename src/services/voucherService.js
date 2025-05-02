import { StatusCodes } from "http-status-codes";
import { voucherModel } from "~/models/voucherModel";
import ApiError from "~/utils/ApiError";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from "~/utils/constants";

const createNew = async (reqData) => {
  try {
    const createdVoucher = await voucherModel.createNew(reqData);

    const getNewVoucher = await voucherModel.getVoucherById(
      createdVoucher.insertedId
    );

    return getNewVoucher;
  } catch (error) {
    throw error;
  }
};

const checkVoucher = async (code, hotelId) => {
  try {
    const checkCode = await voucherModel.findOneByCode(code);
    if (!checkCode) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Voucher không tồn tại!!!");
    }

    const result = await voucherModel.checkVoucher(code, hotelId);

    return result;
  } catch (error) {
    throw error;
  }
};

const getVouchers = async (page, itemsPerPage, queryFilter) => {
  try {
    if (!page) page = DEFAULT_PAGE;
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE;

    const results = await voucherModel.getVouchers(
      parseInt(page, 10),
      parseInt(itemsPerPage, 10),
      queryFilter
    );

    return results;
  } catch (error) {
    throw error;
  }
};

const getVoucherById = async (voucherId) => {
  try {
    const foundVoucher = await voucherModel.getVoucherById(voucherId);

    return foundVoucher;
  } catch (error) {
    throw error;
  }
};

const update = async (voucherId, updateData) => {
  try {
    const updatedVoucher = await voucherModel.update(voucherId, updateData);

    return updatedVoucher;
  } catch (error) {
    throw error;
  }
};

const deleteVoucher = async (voucherId) => {
  try {
    const deletedVoucher = await voucherModel.deleteVoucher(voucherId);

    return deletedVoucher;
  } catch (error) {
    throw error;
  }
};

export const voucherService = {
  createNew,
  checkVoucher,
  getVouchers,
  getVoucherById,
  update,
  deleteVoucher,
};
