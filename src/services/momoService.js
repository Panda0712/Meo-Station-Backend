import crypto from "crypto";
import axios from "axios";
import { ACCESS_KEY_MOMO, SECRET_KEY_MOMO } from "~/utils/constants";

const createPayment = async (reqData) => {
  const { amount, orderInfo: orderInfoData } = reqData;

  var orderInfo = "pay with MoMo";
  var partnerCode = "MOMO";
  var redirectUrl = "https://fast-food-ecommerce.vercel.app/success";
  var ipnUrl =
    "https://1589-2402-800-63a8-dd41-550-3021-3cf6-a760.ngrok-free.app/callback";
  var requestType = "payWithMethod";
  var orderId = partnerCode + new Date().getTime();
  var requestId = orderId;
  var extraData = Buffer.from(JSON.stringify(orderInfoData)).toString("base64");
  var orderGroupId = "";
  var autoCapture = true;
  var lang = "vi";

  var rawSignature =
    "accessKey=" +
    accessKey +
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
    .createHmac("sha256", secretKey)
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
    orderData: orderInfoData,
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
  const { extraData } = reqData;

  let orderDataBody;
  if (extraData) {
    try {
      orderDataBody = JSON.parse(
        Buffer.from(extraData, "base64").toString("utf-8")
      );
    } catch (error) {
      throw new Error(error);
    }
  }
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
