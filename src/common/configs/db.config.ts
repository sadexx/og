import "dotenv/config";
import { DataSource } from "typeorm";
import { ENVIRONMENT, POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from "./config";
import { join } from "path";
import * as fs from "fs";
import { EEnvironment } from "../enums";

const isProduction = ENVIRONMENT === EEnvironment.PRODUCTION;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: POSTGRES_HOST,
  port: POSTGRES_PORT as number,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  entities: [join(__dirname, "../../modules/**/**/*.entity{.ts,.js}")],
  migrations: [__dirname + "../../modules/migrations/*.{js,ts}"],
  migrationsRun: true,
  synchronize: true,
  logging: false,
  ssl: isProduction,
  extra: isProduction
    ? {
        ssl: {
          rejectUnauthorized: true,
          ca: [fs.readFileSync(__dirname + "/../../../global-bundle.pem").toString()]
        }
      }
    : {}
});
