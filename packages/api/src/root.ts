import { eventsRouter } from "./router/events";
import { tasksRouter } from "./router/tasks";
import { userRouter } from "./router/user";
import { wishRouter } from "./router/wishlist";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  events: eventsRouter,
  user: userRouter,
  tasks: tasksRouter,
  wish: wishRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
