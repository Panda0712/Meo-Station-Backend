import axios from "axios";
import CryptoJS from "crypto-js";
import moment from "moment";
import { bookingModel } from "~/models/bookingModel";
import { BOOKING_STATUS, ZALOPAY_CONFIG } from "~/utils/constants";

const createPayment = async (reqData) => {
  const bookingInfoData = reqData;

  const { totalPrice: amount } = bookingInfoData;

  const embed_data = {
    redirecturl: "http://localhost:5173/booking/complete",
    amount,
    bookingInfoData,
  };

  const items = [{}];
  const transID = Math.floor(Math.random() * 1000000);
  const order = {
    app_id: ZALOPAY_CONFIG.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
    app_user: "user123",
    app_time: Date.now(),
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: amount,
    description: `Lazada - Payment for the order #${transID}`,
    bank_code: "",
    callback_url:
      "https://5870-115-76-103-197.ngrok-free.app/v1/payment/zalopay/callback",
  };

  const data =
    ZALOPAY_CONFIG.app_id +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;
  order.mac = CryptoJS.HmacSHA256(data, ZALOPAY_CONFIG.key1).toString();

  try {
    const result = await axios.post(ZALOPAY_CONFIG.endpoint, null, {
      params: order,
    });

    return result.data;
  } catch (error) {
    throw new Error(error);
  }
};

const callbackPayment = async (reqData) => {
  let result = {};

  try {
    let dataStr = reqData.data;
    let reqMac = reqData.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, ZALOPAY_CONFIG.key2).toString();

    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      let dataJson = JSON.parse(dataStr, ZALOPAY_CONFIG.key2);
      console.log(
        "update order's status = success where app_trans_id =",
        dataJson["app_trans_id"]
      );

      const embedData = JSON.parse(dataJson["embed_data"]);

      const bookingInfoData = embedData.bookingInfoData;

      if (!bookingInfoData) {
        console.error("Booking info data not found in embed_data");
        result.return_code = 0;
        result.return_message = "missing_booking_data";
        return result;
      }

      let updateData = {
        ...bookingInfoData,
        status: BOOKING_STATUS.COMPLETED,
      };

      const createdBooking = await bookingModel.createNew(updateData);

      result.return_code = 1;
      result.return_message = "success";

      return createdBooking;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const zalopayService = { createPayment, callbackPayment };
