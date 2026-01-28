import { Router } from "express";
import {
  createEventController,
  getUserEventsController,
} from "../controllers/event.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const eventRouter = Router();

eventRouter.post("/create", passportAuthenticateJwt, createEventController);
eventRouter.get("/all", passportAuthenticateJwt, getUserEventsController);

export default eventRouter;
