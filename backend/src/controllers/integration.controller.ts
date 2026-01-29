import {
  IntegrationAppTypeEnum,
  IntegrationCategoryEnum,
  IntegrationProviderEnum,
} from "../database/entities/integretion";
import {
  connectAppService,
  checkIntegrationService,
  getUserIntegrationsService,
  createIntegrationService,
} from "../services/integration.service";
import { Request, Response } from "express";
import { config } from "../config/app.config";
import { decodeState } from "../utils/helper";
import { HTTPSTATUS } from "../config/http.config";
import { googleOAuth2Client } from "../config/oauth.config";
import { AppTypeDTO } from "../database/dto/integration.dto";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { asyncHandlerAndValidation } from "../middleware/withValidation.middleware";

const CLIENT_APP_URL = config.FRONTEND_INTEGRATION_URL;

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

export const googleOAuthCallbackController = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, state } = req.query;

    const CLIENT_URL = `${CLIENT_APP_URL}?app_type=google`;

    if (!code || typeof code !== "string") {
      return res.redirect(`${CLIENT_URL}&error=Invalid authorization`);
    }

    if (!state || typeof state !== "string") {
      return res.redirect(`${CLIENT_URL}&error=Invalid state`);
    }

    const { userId } = decodeState(state);

    if (!userId) {
      return res.redirect(`${CLIENT_URL}&error=UserId is required`);
    }

    const { tokens } = await googleOAuth2Client.getToken(code);

    if (!tokens.access_token) {
      return res.redirect(`${CLIENT_URL}&error=Access token not passed`);
    }

    await createIntegrationService({
      userId: userId,
      provider: IntegrationProviderEnum.GOOGLE,
      category: IntegrationCategoryEnum.CALENDAR_AND_VIDEO_CONFERENCING,
      app_type: IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || null,
      expiry_date: tokens.expiry_date || null,
      metadata: {
        scope: tokens.scope,
        tokenType: tokens.token_type,
      },
    });

    return res.redirect(`${CLIENT_URL}&success=true`);
  },
);
