import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import http from "http";
import socketIo from "socket.io";
import exitHook from "async-exit-hook";
import { corsOptions } from "~/config/cors";
import { errorHandlingMiddleware } from "~/middlewares/errorHandlingMiddleware";
import { CLOSE_DB, CONNECT_DB } from "~/config/mongodb";
import { APIs_V1 } from "~/routes/v1";
import { env } from "~/config/environment";

const START_SERVER = () => {
  const app = express();

  app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use("/v1", APIs_V1);
  app.use(errorHandlingMiddleware);

  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: corsOptions,
  });
  io.on("connection", (socket) => {
    ////
  });

  if (env.BUILD_MODE === "production") {
    server.listen(process.env.PORT, () => {
      console.log(
        `Production: Hello ${env.AUTHOR}, I am running at PORT: ${process.env.PORT}/`
      );
    });
  } else {
    server.listen(env.APP_PORT, env.APP_HOST, () => {
      console.log(
        `Local DEV: Hello ${env.AUTHOR}, I am running at http://${env.APP_HOST}:${env.APP_PORT}/`
      );
    });
  }

  exitHook(() => {
    CLOSE_DB();
  });
};

(async () => {
  try {
    await CONNECT_DB();
    console.log("Successfully connected to MongoDB Atlas");

    // Start the backend server after successfully connected to the MongoDB
    START_SERVER();
  } catch (err) {
    console.error(err);
    process.exit(0);
  }
})();
