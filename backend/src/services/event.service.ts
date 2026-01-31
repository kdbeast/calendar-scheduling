import {
  Event,
  EventLocationTypeEnum,
} from "../database/entities/event.entity";
import { slugify } from "../utils/helper";
import { User } from "../database/entities/user.entity";
import { AppDataSource } from "../config/database.config";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { CreateEventDto, UserNameAndSlugDTO } from "../database/dto/event.dto";

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

export const toggleEventStatusService = async (
  userId: string,
  eventId: string,
) => {
  const eventRepository = AppDataSource.getRepository(Event);

  const event = await eventRepository.findOne({
    where: {
      id: eventId,
      user: { id: userId },
    },
  });

  if (!event) {
    throw new NotFoundException("Event not found");
  }

  event.isPrivate = !event.isPrivate;

  await eventRepository.save(event);

  return event;
};

export const getPublicEventByUsernameService = async (username: string) => {
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.events", "event", "event.isPrivate = :isPrivate", {
      isPrivate: false,
    })
    .loadRelationCountAndMap("event._count.meetings", "event.meetings")
    .where("user.username = :username", { username })
    .select(["user.id", "user.name", "user.imageUrl"])
    .addSelect([
      "event.id",
      "event.title",
      "event.description",
      "event.slug",
      "event.duration",
      "event.locationType",
    ])
    .orderBy("event.createdAt", "DESC")
    .getOne();

  if (!user) {
    throw new NotFoundException("User not found");
  }

  return {
    user: {
      name: user.name,
      username: username,
      imageUrl: user.imageUrl,
    },
    events: user.events,
  };
};

export const getPublicEventByUsernameAndSlugService = async (
  usernameAndSlugDto: UserNameAndSlugDTO,
) => {
  const { username, slug } = usernameAndSlugDto;
  const eventRepository = AppDataSource.getRepository(Event);

  const event = await eventRepository
    .createQueryBuilder("event")
    .leftJoinAndSelect("event.user", "user")
    .where("user.username = :username", { username })
    .andWhere("event.slug = :slug", { slug })
    .andWhere("event.isPrivate = :isPrivate", { isPrivate: false })
    .addSelect([
      "event.id",
      "event.title",
      "event.description",
      "event.slug",
      "event.duration",
      "event.locationType",
    ])
    .addSelect(["user.id", "user.name", "user.imageUrl"])
    .getOne();

  if (!event) {
    throw new NotFoundException("Event not found");
  }

  return event;
};

export const deleteEventService = async (userId: string, eventId: string) => {
  const eventRepository = AppDataSource.getRepository(Event);

  const event = await eventRepository.findOne({
    where: {
      id: eventId,
      user: { id: userId },
    },
  });

  if (!event) {
    throw new NotFoundException("Event not found");
  }

  await eventRepository.remove(event);

  return { success: true };
};
