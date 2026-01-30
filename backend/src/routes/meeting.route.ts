import express from "express";
import {
  cancelMeetingController,
  getUserMeetingsController,
  createMeetingBookingForGuestController,
} from "../controllers/meeting.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const meetingRouter = express.Router();

meetingRouter.get("/user/all", passportAuthenticateJwt, getUserMeetingsController);

meetingRouter.post("/public/create", createMeetingBookingForGuestController);

meetingRouter.put(
  "/cancel/:meetingId",
  passportAuthenticateJwt,
  cancelMeetingController,
);

export default meetingRouter;
