import { LessThan, MoreThan } from "typeorm";
import { AppDataSource } from "../config/database.config";
import { Meeting, MeetingStatus } from "../database/entities/meeting.entity";
import {
  MeetingFilterEnum,
  MeetingFilterEnumType,
} from "../enums/meeting.enum";

export const getUserMeetingsService = async (
  userId: string,
  filter: MeetingFilterEnumType,
) => {
  const meetingRepository = AppDataSource.getRepository(Meeting);

  const where: any = { user: { id: userId } };

  if (filter === MeetingFilterEnum.UPCOMING) {
    where.status = MeetingStatus.SCHEDULED;
    where.startTime = MoreThan(new Date());
  } else if (filter === MeetingFilterEnum.PAST) {
    where.status = MeetingStatus.SCHEDULED;
    where.startTime = LessThan(new Date());
  } else if (filter === MeetingFilterEnum.CANCELLED) {
    where.status = MeetingStatus.CANCELLED;
  } else {
    where.status = MeetingStatus.SCHEDULED;
    where.startTime = MoreThan(new Date());
  }

  const meetings = await meetingRepository.find({
    where,
    relations: ["event"],
    order: { startTime: "ASC" },
  });

  return meetings || [];
};
