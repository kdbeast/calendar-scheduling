import { Router } from "express";
import { passportAuthenticateJwt } from "../config/passport.config";
import { createEventController } from "../controllers/event.controller";

const eventRouter = Router();

eventRouter.post("/create", passportAuthenticateJwt, createEventController);

export default eventRouter;
