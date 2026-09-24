import { MigrationConfig } from "drizzle-orm/migrator";
import { migrationConfig } from "./db/MigrationConfig.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

process.loadEnvFile();
const port = process.env.PORT;
const dbURL = process.env.DB_URL;
const platform = process.env.PLATFORM;
const tokeSecret = process.env.TOKEN_SECRET;
const polkaKey = process.env.POLKA_KEY;
type APIConfig = {
  port: number;
  dbURL: string;
  PLATFORM: string;
  polkaKey: string;
};

type DBConfig = {
  dbConnString: string;
  migrationConfig: MigrationConfig;
};

export type Config = {
  api: APIConfig;
  db: DBConfig;
  fileserverHits: number;
  tokenSecret: string;
};
export const configObj: Config = {
  api: {
    port: parseInt(port || "8080", 10),
    dbURL: dbURL as string,
    PLATFORM: platform as string,
    polkaKey: polkaKey as string,
  },
  db: {
    dbConnString: process.env.DB_URL as string,
    migrationConfig: migrationConfig,
  },
  fileserverHits: 0,
  tokenSecret: tokeSecret as string,
};

const migrationClient = postgres(configObj.db.dbConnString, { max: 1 });
await migrate(drizzle(migrationClient), configObj.db.migrationConfig);
