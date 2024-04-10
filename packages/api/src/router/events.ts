import type { TRPCRouterRecord } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { and, eq, schema } from "@acme/db";

import { protectedProcedure, publicProcedure } from "../trpc";

export const ZNewEvent = z.object({
  name: z.string(),
  type: z.string().optional(),
  date: z.date().optional(),
  place: z.string().optional(),
  time: z.string().optional(),
  image: z.string().optional(),
});

export const ZEventUpdate = ZNewEvent.partial();

export const eventsRouter = {
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.eventTable.findMany({
      where: eq(schema.eventTable.userId, ctx.user.id),
    });
  }),

  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.query.eventTable.findMany({
      where: and(
        eq(schema.eventTable.userId, ctx.user.id),
        eq(schema.eventTable.id, input),
      ),
    });
  }),

  create: protectedProcedure.input(ZNewEvent).mutation(({ ctx, input }) => {
    return ctx.db.insert(schema.eventTable).values({
      ...input,
      id: uuidv4(),
      userId: ctx.user.id,
    });
  }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), update: ZEventUpdate }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(schema.eventTable)
        .set({ ...input })
        .where(
          and(
            eq(schema.eventTable.userId, ctx.user.id),
            eq(schema.eventTable.id, input.id),
          ),
        )
        .returning();
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db
      .delete(schema.eventTable)
      .where(
        and(
          eq(schema.eventTable.userId, ctx.user.id),
          eq(schema.eventTable.id, input),
        ),
      );
  }),
} satisfies TRPCRouterRecord;
