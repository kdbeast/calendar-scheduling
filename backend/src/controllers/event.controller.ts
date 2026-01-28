import {
  createEventService,
  getUserEventService,
} from "../services/event.service";
import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { CreateEventDto } from "../database/dto/event.dto";
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
    return res.status(HTTPSTATUS.CREATED).json({
      message: "Event created successfully",
      events,
      username,
    });
  },
);
