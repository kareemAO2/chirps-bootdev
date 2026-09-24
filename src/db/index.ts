import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema.js";
import { configObj } from "../config.js";

const conn = postgres(configObj.db.dbConnString);
export const db = drizzle(conn, { schema });
