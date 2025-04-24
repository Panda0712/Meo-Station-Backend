import axios from "axios";
import crypto from "crypto";
import { bookingModel } from "~/models/bookingModel";
import {
  ACCESS_KEY_MOMO,
  BOOKING_STATUS,
  SECRET_KEY_MOMO,
} from "~/utils/constants";

const createPayment = async (reqData) => {
  const bookingInfoData = reqData;

  const { totalPrice: amount } = bookingInfoData;

  var orderInfo = "pay with MoMo";
  var partnerCode = "MOMO";
  var redirectUrl = "http://localhost:5173/booking/complete";
  var ipnUrl =
    "https://5870-115-76-103-197.ngrok-free.app/v1/payment/momo/callback";
  var requestType = "payWithMethod";
  var orderId = partnerCode + new Date().getTime();
  var requestId = orderId;
  var extraData = Buffer.from(JSON.stringify(bookingInfoData)).toString(
    "base64"
  );
  var orderGroupId = "";
  var autoCapture = true;
  var lang = "vi";

  var rawSignature =
    "accessKey=" +
    ACCESS_KEY_MOMO +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;

  var signature = crypto
    .createHmac("sha256", SECRET_KEY_MOMO)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    orderData: bookingInfoData,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
  });

  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  try {
    const result = await axios(options);
    return result.data;
  } catch (error) {
    throw new Error(error);
  }
};

const callbackPayment = async (reqData) => {
  const { extraData, resultCode } = reqData;

  if (resultCode !== 0) {
    console.log("Payment failed with code:", resultCode);
    return { success: false, message: "Payment failed" };
  }

  let bookingData;
  if (extraData) {
    try {
      bookingData = JSON.parse(
        Buffer.from(extraData, "base64").toString("utf-8")
      );
    } catch (error) {
      throw new Error("Failed to parse extraData: " + error.message);
    }
  }

  const updatedBooking = {
    ...bookingData,
    status: BOOKING_STATUS.COMPLETED,
  };

  const createdBooking = await bookingModel.createNew(updatedBooking);

  return createdBooking;
};

const checkTransactionStatus = async (id) => {
  const rawSignature = `accessKey=${ACCESS_KEY_MOMO}&orderId=${id}&partnerCode=MOMO&requestId=${id}`;

  const signature = crypto
    .createHmac("sha256", SECRET_KEY_MOMO)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: "MOMO",
    requestId: id,
    orderId: id,
    signature: signature,
    lang: "vi",
  });

  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/query",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestBody,
  };

  try {
    const result = await axios(options);
    return result.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const momoService = {
  createPayment,
  callbackPayment,
  checkTransactionStatus,
};
