import type { Config } from "drizzle-kit";

import { env } from ".";

export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: ["PBXKK_*"],
} satisfies Config;
