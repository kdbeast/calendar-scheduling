import {
  IsEnum,
  IsUUID,
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
}

export class EventIdDTO {
  @IsUUID(4, { message: "Invalid uuid" })
  @IsNotEmpty()
  eventId: string;
}
