import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { CreateEventDto } from "../database/dto/event.dto";
import { createEventService } from "../services/event.service";
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
