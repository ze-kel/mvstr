import type { TRPCRouterRecord } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { schema } from "@acme/db";

import { protectedProcedure } from "../trpc";

export type ITask = typeof schema.taskTable.$inferSelect;

export const userRouter = {
  getAllTasks: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.taskTable.findFirst({
      where: eq(schema.taskTable.userId, ctx.user.id),
    });
  }),
  getTasksForEvent: protectedProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db.query.taskTable.findFirst({
        where: and(
          eq(schema.taskTable.eventId, input),
          eq(schema.taskTable.userId, ctx.user.id),
        ),
      });
    }),
  addTaskToEvent: protectedProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db.query.taskTable.findFirst({
        where: and(
          eq(schema.taskTable.eventId, input),
          eq(schema.taskTable.userId, ctx.user.id),
        ),
      });
    }),
} satisfies TRPCRouterRecord;
