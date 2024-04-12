import { createEnv } from "@t3-oss/env-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import * as z from "zod";

import {
  eventTable,
  guestsTable,
  sessionTable,
  taskTable,
  userTable,
} from "./schema";

export * from "drizzle-orm";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

const schema = {
  userTable,
  sessionTable,
  eventTable,
  guestsTable,
  taskTable,
};

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

if (process.env.MIGRATE === "true") {
  void migrate(db, { migrationsFolder: "./drizzle" });
}

export { pool, db, schema };
