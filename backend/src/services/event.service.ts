import {
  Event,
  EventLocationTypeEnum,
} from "../database/entities/event.entity";
import { slugify } from "../utils/helper";
import { BadRequestException } from "../utils/app-error";
import { AppDataSource } from "../config/database.config";
import { CreateEventDto } from "../database/dto/event.dto";

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
