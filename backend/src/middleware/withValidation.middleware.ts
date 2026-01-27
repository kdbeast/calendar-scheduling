import { HTTPSTATUS } from "../config/http.config";
import { plainToInstance } from "class-transformer";
import { ErrorCodeEnum } from "../enums/error-code.enum";
import { asyncHandler } from "./asyncHandler.middleware";
import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";

export type ValidationSource = "body" | "query" | "params";

export const asyncHandlerAndValidation = <T extends object>(
  dto: new () => T,
  source: ValidationSource = "body",
  handler: (req: Request, res: Response, dto: T) => Promise<any>,
) => {
  return asyncHandler(withValidation(dto, source)(handler));
}

export const withValidation = <T extends object>(
  DtoClass: new () => T,
  source: ValidationSource = "body",
) => {
  return (handler: (req: Request, res: Response, dto: T) => Promise<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = plainToInstance(DtoClass, req[source]);
        const errors = await validate(dto);

        if (errors?.length > 0) {
          return formatValidationError(res, errors);
        }

        return handler(req, res, dto);
      } catch (error) {
        return next(error);
      }
    };
  };
};

export const formatValidationError = (res: Response, errors: ValidationError[]) => {
  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: "Validation failed",
    errorCode: ErrorCodeEnum.VALIDATION_ERROR,
    errors: errors.map((err: ValidationError) => ({
      field: err.property,
      message: err.constraints,
    })),
  });
}
