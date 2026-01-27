import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { plainToInstance } from "class-transformer";
import { RegisterDto } from "../database/dto/auth.dto";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { validate } from "class-validator";
import { ErrorCodeEnum } from "../enums/error-code.enum";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const registerDto = plainToInstance(RegisterDto, req.body);

    const errors = await validate(registerDto);

    if (errors?.length > 0) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Validation failed",
        errorCode: ErrorCodeEnum.VALIDATION_ERROR,
        errors: errors.map((err) => ({
          field: err.property,
          message: err.constraints,
        })),
      });
    }

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User registered successfully",
    });
  },
);
