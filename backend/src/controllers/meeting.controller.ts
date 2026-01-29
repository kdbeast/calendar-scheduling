import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { getUserMeetingsService } from "../services/meeting.service";
import {
  MeetingFilterEnum,
  MeetingFilterEnumType,
} from "../enums/meeting.enum";

export const getUserMeetingsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const filter =
      (req.query.filter as MeetingFilterEnumType) || MeetingFilterEnum.UPCOMING;

    const meetings = await getUserMeetingsService(userId, filter);

    res.status(HTTPSTATUS.OK).json({
      message: "Meetings fetched successfully",
      meetings,
    });
  },
);
