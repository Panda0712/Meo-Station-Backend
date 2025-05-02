import express from "express";
import { voucherController } from "~/controllers/voucherController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { voucherValidation } from "~/validations/voucherValidation";

const Router = express.Router();

Router.route("/")
  .post(
    authMiddleware.isAuthorized,
    voucherValidation.createNew,
    voucherController.createNew
  )
  .get(authMiddleware.isAuthorized, voucherController.getVouchers);

Router.route("/check").get(
  authMiddleware.isAuthorized,
  voucherValidation.checkVoucher,
  voucherController.checkVoucher
);

Router.route("/:voucherId")
  .get(
    authMiddleware.isAuthorized,
    voucherValidation.getVoucherById,
    voucherController.getVoucherById
  )
  .put(
    authMiddleware.isAuthorized,
    voucherValidation.update,
    voucherController.update
  )
  .delete(
    authMiddleware.isAuthorized,
    voucherValidation.deleteVoucher,
    voucherController.deleteVoucher
  );

export const voucherRoute = Router;
