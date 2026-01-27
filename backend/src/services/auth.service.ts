import { v4 as uuidv4 } from "uuid";
import { RegisterDto } from "../database/dto/auth.dto";
import { User } from "../database/entities/user.entity";
import { BadRequestException } from "../utils/app-error";
import { AppDataSource } from "../config/database.config";
import { Availability } from "../database/entities/availability.entity";
import {
  DayAvailability,
  DayOfWeekEnum,
} from "../database/entities/day-availability";

export const registerService = async (registerDto: RegisterDto) => {
  const userRepository = AppDataSource.getRepository(User);
  const availabilityRepository = AppDataSource.getRepository(Availability);
  const dayAvailabilityRepository =
    AppDataSource.getRepository(DayAvailability);

  const existingUser = await userRepository.findOne({
    where: { email: registerDto.email },
  });

  if (existingUser) {
    throw new BadRequestException("User already exists");
  }

  const username = await generateUsername(registerDto.name);
  const user = userRepository.create({ ...registerDto, username });
  await userRepository.save(user);

  const availability = availabilityRepository.create({
    timeGap: 30,
    days: Object.values(DayOfWeekEnum).map((day) => {
      return dayAvailabilityRepository.create({
        day: day,
        startTime: new Date(`2026-01-27T09:00:00Z`),
        endTime: new Date(`2026-01-27T17:00:00Z`),
        isAvailable:
          day !== DayOfWeekEnum.SUNDAY && day !== DayOfWeekEnum.SATURDAY,
      });
    }),
  });

  user.availability = [availability];
  await userRepository.save(user);

  return { user: user.omitPassword() };
};

async function generateUsername(name: string): Promise<string> {
  const cleanName = name.replace(/\s+/g, "").toLowerCase();
  const baseUsername = cleanName;

  const uuidSuffix = uuidv4().replace(/\s+/g, "").slice(0, 4);
  const userRepository = AppDataSource.getRepository(User);

  let username = `${baseUsername}${uuidSuffix}`;

  let existingUser = await userRepository.findOne({
    where: { username },
  });

  while (existingUser) {
    username = `${baseUsername}${uuidv4().replace(/\s+/g, "").slice(0, 4)}`;
    existingUser = await userRepository.findOne({
      where: { username },
    });
  }

  return username;
}
