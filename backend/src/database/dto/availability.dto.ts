import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { DayOfWeekEnum } from "../entities/day-availability";

export class DayAvailabilityDto {
  @IsEnum(DayOfWeekEnum)
  day: DayOfWeekEnum;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsBoolean()
  @IsNotEmpty()
  isAvailable: boolean;
}

export class UpdateAvailabilityDto {
  @IsNumber()
  @IsNotEmpty()
  timeGap: number;

  @IsArray()
  @Type(() => DayAvailabilityDto)
  @ValidateNested({ each: true })
  days: DayAvailabilityDto[];
}
