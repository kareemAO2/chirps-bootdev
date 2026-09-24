import type { MigrationConfig } from "drizzle-orm/migrator";
process.loadEnvFile();

export const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};
