import { Router } from "express";
import {
  createEventController,
  deleteEventController,
  getUserEventsController,
  toggleEventStatusController,
  getPublicEventByUsernameController,
  getPublicEventByUsernameAndSlugController,
} from "../controllers/event.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const eventRouter = Router();

eventRouter.get("/all", passportAuthenticateJwt, getUserEventsController);
eventRouter.post("/create", passportAuthenticateJwt, createEventController);
eventRouter.put(
  "/toggle-privacy",
  passportAuthenticateJwt,
  toggleEventStatusController,
);
eventRouter.get("/public/:username", getPublicEventByUsernameController);
eventRouter.get(
  "/public/:username/:slug",
  getPublicEventByUsernameAndSlugController,
);
eventRouter.delete("/:eventId", passportAuthenticateJwt, deleteEventController);

export default eventRouter;
