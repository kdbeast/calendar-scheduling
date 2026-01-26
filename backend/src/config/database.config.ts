import path from "path";
import { DataSource } from "typeorm";
import { config } from "./app.config";

export const getDataConfig = () => {
  const isProduction = config.NODE_ENV === "production";
  const databaseUrl = config.DATABASE_URL;

  return new DataSource({
    type: "postgres",
    url: databaseUrl,
    entities: [path.join(__dirname, "../database/entities/*.{js,ts}")],
    migrations: [path.join(__dirname, "../database/migrations/*.{js,ts}")],
    synchronize: !isProduction,
    logging: isProduction ? false : ["error"],
    ssl: isProduction
      ? { rejectUnauthorized: true }
      : { rejectUnauthorized: false },
  });
};

export const AppDataSource = getDataConfig();