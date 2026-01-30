import {
  MeetingFilterEnum,
  MeetingFilterEnumType,
} from "../enums/meeting.enum";
import {
    cancelMeetingService,
  getUserMeetingsService,
  createMeetingBookingForGuestService,
} from "../services/meeting.service";
import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { CreateMeetingDto, MeetingIdDto } from "../database/dto/meeting.dto";
import { asyncHandlerAndValidation } from "../middleware/withValidation.middleware";

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

export const createMeetingBookingForGuestController = asyncHandlerAndValidation(
  CreateMeetingDto,
  "body",
  async (req: Request, res: Response, CreateMeetingDto) => {
    const { meetLink, meeting } =
      await createMeetingBookingForGuestService(CreateMeetingDto);

    res.status(HTTPSTATUS.CREATED).json({
      message: "Meeting created successfully",
      meeting,
      meetLink,
    });
  },
);

export const cancelMeetingController = asyncHandlerAndValidation(
  MeetingIdDto,
  "params",
  async (req: Request, res: Response, MeetingIdDto) => {
    await cancelMeetingService(MeetingIdDto.meetingId);

    res.status(HTTPSTATUS.OK).json({
      message: "Meeting cancelled successfully",
    });
  },
);
