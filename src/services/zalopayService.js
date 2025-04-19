import { ZALOPAY_CONFIG } from "~/utils/constants";
import CryptoJS from "crypto-js";
import axios from "axios";

const createPayment = async (reqData) => {
  const { amount, orderInfo } = reqData;

  const embed_data = {
    redirecturl: "https://fast-food-ecommerce.vercel.app/success",
    amount,
    orderInfo,
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
      "https://4876-2402-800-63a8-dd41-550-3021-3cf6-a760.ngrok-free.app/callback",
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

      const { amount, orderInfo } = embedData;

      let updateData = [...orderInfo.orderData];

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const zalopayService = { createPayment, callbackPayment };
