import type { TRPCRouterRecord } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import getMeta from "url-metadata";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { schema } from "@acme/db";

import { protectedProcedure } from "../trpc";

const ZWish = createInsertSchema(schema.wishTable);

const zNewWish = createInsertSchema(schema.wishTable, {
  id: z.undefined(),
  userId: z.undefined(),
});

export type IWish = typeof schema.wishTable.$inferSelect;
export type INewWish = z.infer<typeof zNewWish>;

export const wishRouter = {
  getAllWishes: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.wishTable.findMany({
      where: eq(schema.wishTable.userId, ctx.user.id),
    });
  }),

  addWish: protectedProcedure
    .input(zNewWish)
    .mutation(async ({ ctx, input }) => {
      const id = uuidv4();

      const n = await ctx.db
        .insert(schema.wishTable)
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
  updateWish: protectedProcedure
    .input(z.object({ wishId: z.string(), update: ZWish.partial() }))
    .mutation(async ({ ctx, input }) => {
      const n = await ctx.db
        .update(schema.wishTable)
        .set({ ...input.update, id: input.wishId, userId: ctx.user.id })
        .where(
          and(
            eq(schema.wishTable.id, input.wishId),
            eq(schema.wishTable.userId, ctx.user.id),
          ),
        )
        .returning();

      if (!n[0]) {
        throw new Error("Failed update");
      }
      return n[0];
    }),

  getUrlInfo: protectedProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ input }) => {
      return getMeta(input.url, {
        requestHeaders: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "Accept-Language": "en-US,en;q=0.9,ru;q=0.8,zh-TW;q=0.7,zh;q=0.6",
          "Cache-Control": "no-cache",
          "Accept-Encoding": "gzip, deflate, br",
        },
      });
    }),
} satisfies TRPCRouterRecord;
