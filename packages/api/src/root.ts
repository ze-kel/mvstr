import { eventsRouter } from "./router/events";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  events: eventsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
