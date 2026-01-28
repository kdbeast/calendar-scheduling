import { Router } from "express";
import {
  createEventController,
  getUserEventsController,
  toggleEventStatusController,
} from "../controllers/event.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const eventRouter = Router();

eventRouter.post("/create", passportAuthenticateJwt, createEventController);
eventRouter.get("/all", passportAuthenticateJwt, getUserEventsController);
eventRouter.put(
  "/toggle-privacy",
  passportAuthenticateJwt,
  toggleEventStatusController,
);

export default eventRouter;
