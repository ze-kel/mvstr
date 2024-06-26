import { createClient } from "@supabase/supabase-js";
import { createEnv } from "@t3-oss/env-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import * as z from "zod";

import {
  eventRelations,
  eventTable,
  guestRelations,
  guestsTable,
  phoneTokenRequest,
  phoneTokens,
  sessionTable,
  taskTable,
  userRelations,
  userTable,
  wishConnectionsTable,
  wishRelations,
  wishTable,
} from "./schema";

export * from "drizzle-orm";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    SUPABASE_URL: z.string(),
    SUPABASE_KEY: z.string(),
    SUPABASE_BUCKET_URL: z.string(),
    MTS_EXOLVE_TOKEN: z.string(),
    MTS_EXOLVE_NUMBER: z.string(),
    MASTER_CODE: z.string(),
    ENABLE_SMS_CODES: z.boolean({ coerce: true }),
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
  wishTable,
  phoneTokenRequest,
  phoneTokens,
  userRelations,
  eventRelations,
  guestRelations,
  wishConnectionsTable,
  wishRelations,
};

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

if (process.env.MIGRATE === "true") {
  void migrate(db, { migrationsFolder: "./drizzle" });
}

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

export { pool, db, schema, supabase };
