/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import express from "express";
import { StatusCodes } from "http-status-codes";
import { hotelRoute } from "~/routes/v1/hotelRoute";
import { userRoute } from "~/routes/v1/userRoute";

const Router = express.Router();

// Check API V1 Status
Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({
    message: "API V1 are ready to use!",
    code: StatusCodes.OK,
    timestamp: new Date().toISOString(),
  });
});

// Users
Router.use("/users", userRoute);

// Hotels
Router.use("/hotels", hotelRoute);

export const APIs_V1 = Router;
