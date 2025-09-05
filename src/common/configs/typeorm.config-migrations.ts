import "dotenv/config";
import { DataSource } from "typeorm";
import { POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } from "./config";
import { join } from "path";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: POSTGRES_PORT as number,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  entities: [join(__dirname, "../../modules/**/**/*.entity{.ts,.js}")],
  migrations: [__dirname + "../../modules/database/migrations/*.{.js,.ts}"],
  synchronize: false,
  migrationsRun: true
});
