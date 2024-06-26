import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./root";
import type { IEvent, IGuestFull, INewEvent } from "./router/events";
import type { INewTask, ITask } from "./router/tasks";
import type { IUser } from "./router/user";
import type { INewWish, IWish } from "./router/wishlist.js";
import { appRouter } from "./root";
import { createCallerFactory, createTRPCContext } from "./trpc";

/**
 * Create a server-side caller for the tRPC API
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
const createCaller = createCallerFactory(appRouter);

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
type RouterOutputs = inferRouterOutputs<AppRouter>;

export { createTRPCContext, appRouter, createCaller };
export type {
  AppRouter,
  RouterInputs,
  RouterOutputs,
  IEvent,
  INewEvent,
  IUser,
  ITask,
  INewTask,
  IWish,
  INewWish,
  IGuestFull,
};
