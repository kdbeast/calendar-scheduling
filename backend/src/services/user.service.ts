import { User } from "../database/entities/user.entity";
import { AppDataSource } from "../config/database.config";

export const findByIdUserService = async (userId: string) => {
  const userRepository = AppDataSource.getRepository(User);
  return await userRepository.findOne({ where: { id: userId } });
};
