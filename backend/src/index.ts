import "dotenv/config";
import cors from "cors";
import express from "express";
import passport from "passport";
import "./config/passport.config";
import authRouter from "./routes/auth.route";
import { config } from "./config/app.config";
import eventRouter from "./routes/event.route";
import { initializeDatabase } from "./database/database";
import availabilityRouter from "./routes/availability.route";
import { errorHandler } from "./middleware/errorHandler.middleware";

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

app.use(passport.initialize());

app.use(`${BASE_PATH}/auth`, authRouter);
app.use(`${BASE_PATH}/event`, eventRouter);
app.use(`${BASE_PATH}/availability`, availabilityRouter);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  await initializeDatabase();
  console.log(
    `Server is running on port ${config.PORT} in ${config.NODE_ENV} mode`,
  );
});
