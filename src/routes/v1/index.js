import express from "express";
import { StatusCodes } from "http-status-codes";
import { blogRoute } from "~/routes/v1/blogRoute";
import { bookingRoute } from "~/routes/v1/bookingRoute";
import { commentRoute } from "~/routes/v1/commentRoute";
import { contactRoute } from "~/routes/v1/contactRoute";
import { hotelRoute } from "~/routes/v1/hotelRoute";
import { momoRoute } from "~/routes/v1/momoRoute";
import { notificationRoute } from "~/routes/v1/notificationRoute";
import { userRoute } from "~/routes/v1/userRoute";
import { voucherRoute } from "~/routes/v1/voucherRoute";
import { zalopayRoute } from "~/routes/v1/zalopayRoute";

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

// Contacts
Router.use("/contacts", contactRoute);

// Notifications
Router.use("/notifications", notificationRoute);

// Comments
Router.use("/comments", commentRoute);

// Blogs
Router.use("/blogs", blogRoute);

// Vouchers
Router.use("/vouchers", voucherRoute);

// Bookings
Router.use("/bookings", bookingRoute);

// Payment MOMO
Router.use("/payment/momo", momoRoute);

// Payment ZALOPAY
Router.use("/payment/zalopay", zalopayRoute);

export const APIs_V1 = Router;
