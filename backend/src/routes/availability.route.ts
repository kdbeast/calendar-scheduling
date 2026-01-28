import express from "express";
import {
  getUserAvailabilityController,
  updateAvailabilityController,
} from "../controllers/availability.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const availabilityRoute = express.Router();

availabilityRoute.get(
  "/me",
  passportAuthenticateJwt,
  getUserAvailabilityController,
);
availabilityRoute.put(
  "/update",
  passportAuthenticateJwt,
  updateAvailabilityController,
);

export default availabilityRoute;
