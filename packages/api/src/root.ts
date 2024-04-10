import { authRouter } from "./router/auth";
import { eventsRouter } from "./router/events";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  events: eventsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
