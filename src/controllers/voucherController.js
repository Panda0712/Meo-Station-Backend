import { StatusCodes } from "http-status-codes";
import { voucherService } from "~/services/voucherService";

const createNew = async (req, res, next) => {
  try {
    const createdVoucher = await voucherService.createNew(req.body);

    res.status(StatusCodes.CREATED).json(createdVoucher);
  } catch (error) {
    next(error);
  }
};

const getVouchers = async (req, res, next) => {
  try {
    const { page, itemsPerPage, q } = req.query;
    const queryFilter = q;

    const results = await voucherService.getVouchers(
      page,
      itemsPerPage,
      queryFilter
    );

    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(error);
  }
};

const getVoucherById = async (req, res, next) => {
  try {
    const voucherId = req.params.voucherId;

    const foundVoucher = await voucherService.getVoucherById(voucherId);

    res.status(StatusCodes.OK).json(foundVoucher);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const voucherId = req.params.voucherId;

    const updatedVoucher = await voucherService.update(voucherId, req.body);

    res.status(StatusCodes.OK).json(updatedVoucher);
  } catch (error) {
    next(error);
  }
};

const deleteVoucher = async (req, res, next) => {
  try {
    const voucherId = req.params.voucherId;

    const deletedVoucher = await voucherService.deleteVoucher(voucherId);

    res.status(StatusCodes.OK).json(deletedVoucher);
  } catch (error) {
    next(error);
  }
};

export const voucherController = {
  createNew,
  getVouchers,
  getVoucherById,
  update,
  deleteVoucher,
};
