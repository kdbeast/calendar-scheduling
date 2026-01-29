import express from "express";
import { passportAuthenticateJwt } from "../config/passport.config";
import { getUserMeetingsController } from "../controllers/meeting.controller";

const meetingRouter = express.Router();

meetingRouter.get(
  "/user/all",
  passportAuthenticateJwt,
  getUserMeetingsController,
);

export default meetingRouter;
