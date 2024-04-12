import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  shared: {},
  server: {
    VK_CLIENT_KEY: z.string().min(1),
    VK_CLIENT_SECRET: z.string().min(1),
    VK_CLIENT_ID: z.string().min(1),
    VK_CALLBACK: z.string().min(1),
  },
  client: {},
  experimental__runtimeEnv: {},
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});
