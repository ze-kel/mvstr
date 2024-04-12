import { eventsRouter } from "./router/events";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  events: eventsRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
