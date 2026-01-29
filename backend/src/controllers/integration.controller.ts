import {
  connectAppService,
  checkIntegrationService,
  getUserIntegrationsService,
} from "../services/integration.service";
import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { AppTypeDTO } from "../database/dto/integration.dto";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { asyncHandlerAndValidation } from "../middleware/withValidation.middleware";

export const getUserIntegrationsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const integrations = await getUserIntegrationsService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Fetched User integrations successfully",
      integrations,
    });
  },
);

export const checkIntegrationController = asyncHandlerAndValidation(
  AppTypeDTO,
  "params",
  async (req: Request, res: Response, appTypeDto) => {
    const userId = req.user?.id as string;
    const isConnected = await checkIntegrationService(
      userId,
      appTypeDto.appType,
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Fetched User integration successfully",
      isConnected,
    });
  },
);

export const connectAppController = asyncHandlerAndValidation(
  AppTypeDTO,
  "params",
  async (req: Request, res: Response, appTypeDto) => {
    const userId = req.user?.id as string;
    const { url } = await connectAppService(userId, appTypeDto.appType);

    return res.status(HTTPSTATUS.OK).json({
      message: "Fetched User integration successfully",
      url,
    });
  },
);
