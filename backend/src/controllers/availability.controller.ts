import {
  getUserAvailabilityService,
  updateAvailabilityService,
} from "../services/availability.service";
import { HTTPSTATUS } from "../config/http.config";
import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { UpdateAvailabilityDto } from "../database/dto/availability.dto";
import { asyncHandlerAndValidation } from "../middleware/withValidation.middleware";

export const getUserAvailabilityController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const availability = await getUserAvailabilityService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Fetched user availability",
      availability,
    });
  },
);

export const updateAvailabilityController = asyncHandlerAndValidation(
  UpdateAvailabilityDto,
  "body",
  async (req: Request, res: Response, UpdateAvailabilityDto) => {
    const userId = req.user?.id as string;

    await updateAvailabilityService(userId, UpdateAvailabilityDto);

    return res.status(HTTPSTATUS.OK).json({
      message: "Availability updated successfully",
    });
  },
);
