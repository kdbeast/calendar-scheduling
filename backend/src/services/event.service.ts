import {
  Event,
  EventLocationTypeEnum,
} from "../database/entities/event.entity";
import { slugify } from "../utils/helper";
import { User } from "../database/entities/user.entity";
import { AppDataSource } from "../config/database.config";
import { CreateEventDto } from "../database/dto/event.dto";
import { BadRequestException, NotFoundException } from "../utils/app-error";

export const createEventService = async (
  userId: string,
  createEventDto: CreateEventDto,
) => {
  const eventRepository = AppDataSource.getRepository(Event);

  if (
    !Object.values(EventLocationTypeEnum)?.includes(createEventDto.locationType)
  ) {
    throw new BadRequestException("Invalid location type");
  }

  const slug = slugify(createEventDto.title);

  const event = eventRepository.create({
    ...createEventDto,
    user: { id: userId },
    slug,
  });

  await eventRepository.save(event);

  return event;
};

export const getUserEventService = async (userId: string) => {
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.events", "event")
    .loadRelationCountAndMap("event._count.meetings", "event.meetings")
    .where("user.id = :userId", { userId })
    .orderBy("event.createdAt", "DESC")
    .getOne();

  if (!user) {
    throw new NotFoundException("User not found");
  }

  return {
    events: user.events,
    username: user.username,
  };
};
