import cors from "cors";
import { config } from "./config/app.config";
import { HTTPSTATUS } from "./config/http.config";
import { BadRequestException } from "./utils/app-error";
import { initializeDatabase } from "./database/database";
import express, { NextFunction, Request, Response } from "express";
import { errorHandler } from "./middleware/errorHandler.middleware";
import { asyncHandler } from "./middleware/asyncHandler.middleware";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  }),
);

app.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestException("Internal Server Error");
    res.status(HTTPSTATUS.OK).json({
      message: "Welcome to the Calendar Scheduling API",
    });
  }),
);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  await initializeDatabase();
  console.log(
    `Server is running on port ${config.PORT} in ${config.NODE_ENV} mode`,
  );
});
