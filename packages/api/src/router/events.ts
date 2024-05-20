import type { TRPCRouterRecord } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { generateId } from "lucia";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { schema } from "@acme/db";

import type { IUser } from "./user";
import { protectedProcedure, publicProcedure } from "../trpc";

export const ZNewEvent = z.object({
  name: z.string(),
  type: z.string().optional(),
  date: z.date().optional(),
  place: z.string().optional(),
  time: z.string().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
});

export type INewEvent = z.infer<typeof ZNewEvent>;
export type IEvent = typeof schema.eventTable.$inferSelect & {
  guests: IGuestFull[];
};
export type IGuest = typeof schema.guestsTable.$inferSelect;
export type IGuestFull = IGuest & { user: IUser; event: IEvent };

export const ZEventUpdate = ZNewEvent.partial();

export const eventsRouter = {
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.eventTable.findMany({
      where: eq(schema.eventTable.userId, ctx.user.id),
      with: {
        guests: { with: { user: true } },
      },
    });
  }),

  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.query.eventTable.findFirst({
      where: and(
        eq(schema.eventTable.userId, ctx.user.id),
        eq(schema.eventTable.id, input),
      ),
    });
  }),

  create: protectedProcedure
    .input(ZNewEvent)
    .mutation(async ({ ctx, input }) => {
      const n = await ctx.db
        .insert(schema.eventTable)
        .values({
          ...input,
          id: uuidv4(),
          userId: ctx.user.id,
        })
        .returning();

      if (!n[0]) {
        throw new Error("Failed insert");
      }

      return n[0];
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

  getGuests: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const r1 = await ctx.db.query.guestsTable.findMany({
        where: eq(schema.guestsTable.eventId, input),
        with: {
          user: true,
          event: true,
        },
      });

      // TODO: throw if user is not the one in ctx

      return r1;
    }),

  addGuest: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        gender: z.string().optional(),
        phone: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.query.userTable.findFirst({
        where: eq(schema.userTable.phone, input.phone),
      });

      if (existingUser) {
        return await ctx.db.insert(schema.guestsTable).values({
          eventId: input.eventId,
          userId: existingUser.id,
          role: "guest",
        });
      } else {
        const userId = generateId(15);
        const user = await ctx.db.insert(schema.userTable).values({
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          id: userId,
          gender: input.gender,
        });
        return await ctx.db.insert(schema.guestsTable).values({
          eventId: input.eventId,
          userId: userId,
          role: "guest",
        });
      }
    }),

  getWishes: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const res = await ctx.db.query.wishConnectionsTable.findMany({
      where: eq(schema.wishConnectionsTable.eventId, input),
    });

    return res.map((v) => v.wishId) as string[];
  }),

  addWish: protectedProcedure
    .input(
      z.object({
        event: z.string(),
        wish: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(schema.wishConnectionsTable).values({
        id: uuidv4(),
        eventId: input.event,
        wishId: input.wish,
      });
    }),

  removeWish: protectedProcedure
    .input(
      z.object({
        event: z.string(),
        wish: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(schema.wishConnectionsTable)
        .where(
          and(
            eq(schema.wishConnectionsTable.eventId, input.event),
            eq(schema.wishConnectionsTable.wishId, input.wish),
          ),
        );
    }),
} satisfies TRPCRouterRecord;
