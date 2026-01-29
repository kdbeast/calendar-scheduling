import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from "class-validator";

export class CreateMeetingDto {
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsDateString()
  @IsNotEmpty()
  startTime: Date;

  @IsDateString()
  @IsNotEmpty()
  endTime: Date;

  @IsString()
  @IsNotEmpty()
  guestName: string;

  @IsEmail()
  @IsNotEmpty()
  guestEmail: string;

  @IsString()
  @IsOptional()
  additionalInfo: string;
}
