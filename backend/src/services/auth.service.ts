import { v4 as uuidv4 } from "uuid";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/app-error";
import { signJwtToken } from "../utils/jwt";
import {
  DayAvailability,
  DayOfWeekEnum,
} from "../database/entities/day-availability";
import { User } from "../database/entities/user.entity";
import { AppDataSource } from "../config/database.config";
import { LoginDto, RegisterDto } from "../database/dto/auth.dto";
import { Availability } from "../database/entities/availability.entity";

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

  user.availability = availability;
  await userRepository.save(user);

  return { user: user.omitPassword() };
};

export const loginService = async (loginDto: LoginDto) => {
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOne({
    where: { email: loginDto.email },
  });

  if (!user) {
    throw new NotFoundException("User not found");
  }

  const isPasswordValid = await user.comparePassword(loginDto.password);

  if (!isPasswordValid) {
    throw new UnauthorizedException("Invalid email or password");
  }

  const { token, expiresAt } = await signJwtToken({ userId: user.id });

  return { user: user.omitPassword(), accessToken: token, expiresAt };
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
