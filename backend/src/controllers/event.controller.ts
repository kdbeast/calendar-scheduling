import {
  CreateEventDto,
  EventIdDTO,
  UserNameAndSlugDTO,
  UserNameDTO,
} from "../database/dto/event.dto";
import {
  createEventService,
  deleteEventService,
  getUserEventService,
  toggleEventStatusService,
  getPublicEventByUsernameService,
  getPublicEventByUsernameAndSlugService,
} from "../services/event.service";
import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { asyncHandlerAndValidation } from "../middleware/withValidation.middleware";

export const createEventController = asyncHandlerAndValidation(
  CreateEventDto,
  "body",
  async (req: Request, res: Response, CreateEventDto) => {
    const userId = req.user?.id as string;
    const event = await createEventService(userId, CreateEventDto);
    return res.status(HTTPSTATUS.CREATED).json({
      message: "Event created successfully",
      event,
    });
  },
);

export const getUserEventsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const { events, username } = await getUserEventService(userId);
    return res.status(HTTPSTATUS.OK).json({
      message: "User events fetched successfully",
      events,
      username,
    });
  },
);

export const toggleEventStatusController = asyncHandlerAndValidation(
  EventIdDTO,
  "body",
  async (req: Request, res: Response, eventIdDto) => {
    const userId = req.user?.id as string;
    const event = await toggleEventStatusService(userId, eventIdDto.eventId);

    return res.status(HTTPSTATUS.OK).json({
      message: `Event set to ${event.isPrivate ? "private" : "public"} successfully`,
      event,
    });
  },
);

export const getPublicEventByUsernameController = asyncHandlerAndValidation(
  UserNameDTO,
  "params",
  async (req: Request, res: Response, userNameDto) => {
    const { user, events } = await getPublicEventByUsernameService(
      userNameDto.username,
    );
    return res.status(HTTPSTATUS.OK).json({
      message: "Public events fetched successfully",
      user,
      events,
    });
  },
);

export const getPublicEventByUsernameAndSlugController =
  asyncHandlerAndValidation(
    UserNameAndSlugDTO,
    "params",
    async (req: Request, res: Response, userNameAndSlugDto) => {
      const event =
        await getPublicEventByUsernameAndSlugService(userNameAndSlugDto);
      return res.status(HTTPSTATUS.OK).json({
        message: "Event details fetched successfully",
        event,
      });
    },
  );

export const deleteEventController = asyncHandlerAndValidation(
  EventIdDTO,
  "body",
  async (req: Request, res: Response, eventIdDto) => {
    const userId = req.user?.id as string;
    await deleteEventService(userId, eventIdDto.eventId);
    return res.status(HTTPSTATUS.OK).json({
      message: "Event deleted successfully",
    });
  },
);
