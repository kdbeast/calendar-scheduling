import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { RegisterDto } from "../database/dto/auth.dto";
import { registerService } from "../services/auth.service";
import { asyncHandlerAndValidation } from "../middleware/withValidation.middleware";

export const registerUser = asyncHandlerAndValidation(
  RegisterDto,
  "body",
  async (req: Request, res: Response, registerDTO) => {

    const {user}  = await registerService(registerDTO);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User registered successfully",
      user,
    });
  },
);
