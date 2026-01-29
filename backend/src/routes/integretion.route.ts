import express from "express";
import {
  connectAppController,
  checkIntegrationController,
  getUserIntegrationsController,
  googleOAuthCallbackController,
} from "../controllers/integration.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const integrationRouter = express.Router();

integrationRouter.get(
  "/all",
  passportAuthenticateJwt,
  getUserIntegrationsController,
);

integrationRouter.get(
  "/check/:appType",
  passportAuthenticateJwt,
  checkIntegrationController,
);

integrationRouter.get(
  "/connect/:appType",
  passportAuthenticateJwt,
  connectAppController,
);

integrationRouter.get("/google/callback", googleOAuthCallbackController);

export default integrationRouter;
