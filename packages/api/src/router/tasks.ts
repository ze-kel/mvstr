import type { TRPCRouterRecord } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { schema } from "@acme/db";

import { protectedProcedure } from "../trpc";

const zTask = createInsertSchema(schema.taskTable);

const zNewTask = createInsertSchema(schema.taskTable, {
  id: z.undefined(),
  userId: z.undefined(),
});

export type ITask = typeof schema.taskTable.$inferSelect;
export type INewTask = z.infer<typeof zNewTask>;

export const tasksRouter = {
  getAllTasks: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.taskTable.findFirst({
      where: eq(schema.taskTable.userId, ctx.user.id),
    });
  }),
  getTasksForEvent: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.taskTable.findMany({
        where: and(
          eq(schema.taskTable.eventId, input.id),
          eq(schema.taskTable.userId, ctx.user.id),
        ),
      });
    }),
  addTaskToEvent: protectedProcedure
    .input(zNewTask)
    .mutation(async ({ ctx, input }) => {
      const id = uuidv4();

      const n = await ctx.db
        .insert(schema.taskTable)
        .values({
          ...input,
          id,
          userId: ctx.user.id,
        })
        .returning();

      if (!n[0]) {
        throw new Error("Failed insert");
      }

      return n[0];
    }),
  updateTask: protectedProcedure
    .input(z.object({ taskId: z.string(), update: zTask.partial() }))
    .mutation(async ({ ctx, input }) => {
      const n = await ctx.db
        .update(schema.taskTable)
        .set({ ...input.update })
        .where(
          and(
            eq(schema.taskTable.id, input.taskId),
            eq(schema.taskTable.userId, ctx.user.id),
          ),
        )
        .returning();

      if (!n[0]) {
        throw new Error("Failed update");
      }
      return n[0];
    }),
} satisfies TRPCRouterRecord;
