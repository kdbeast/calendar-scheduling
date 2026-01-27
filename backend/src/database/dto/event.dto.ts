import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  IsNotEmpty,
} from "class-validator";
import { EventLocationTypeEnum } from "../entities/event.entity";

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsEnum(EventLocationTypeEnum)
  @IsNotEmpty()
  locationType: EventLocationTypeEnum;

  @IsOptional()
  isPrivate: boolean;

  @IsOptional()
  isAllDay: boolean;

  @IsOptional()
  isRecurring: boolean;
}
