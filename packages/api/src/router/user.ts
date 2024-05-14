import type { TRPCRouterRecord } from "@trpc/server";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { lucia } from "@acme/auth";
import { schema } from "@acme/db";

import { protectedProcedure, publicProcedure } from "../trpc";

export type IUser = typeof schema.userTable.$inferSelect;

export const userRouter = {
  getMe: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.userTable.findFirst({
      where: eq(schema.userTable.id, ctx.user.id),
    });
  }),

  requestPhoneCode: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const lastOne = await ctx.db.query.phoneTokenRequest.findFirst({
        where: eq(schema.phoneTokenRequest.phone, input),
      });

      if (lastOne) {
        if (new Date() < lastOne.expiresAt) {
          return lastOne.expiresAt;
        }
      }

      const code = "111111";
      const expiresAt = new Date(new Date().getTime() + 3 * 60000);

      await ctx.db
        .insert(schema.phoneTokenRequest)
        .values({
          phone: input,
          code: code,
          expiresAt: expiresAt,
        })
        .onConflictDoUpdate({
          target: schema.phoneTokenRequest.phone,
          set: { code, expiresAt },
        });

      return expiresAt;
    }),

  verifyPhoneCode: publicProcedure
    .input(z.object({ phone: z.string(), code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.query.phoneTokenRequest.findFirst({
        where: eq(schema.phoneTokenRequest.phone, input.phone),
      });

      if (!request) {
        throw new Error("No request");
      }

      if (new Date() > request.expiresAt) {
        throw new Error("Expired");
      }

      if (request.code !== input.code) {
        throw new Error("Wrong code");
      }

      const user = await ctx.db.query.userTable.findFirst({
        where: eq(schema.userTable.phone, request.phone),
      });

      if (user) {
        const session = await lucia.createSession(user.id, {});
        return {
          action: "auth" as const,
          token: session.id,
        };
      }

      const t = uuidv4();

      await ctx.db.insert(schema.phoneTokens).values({
        token: uuidv4(),
        phone: input.phone,
        expiresAt: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
      });

      return {
        action: "register" as const,
        token: t,
      };
    }),
} satisfies TRPCRouterRecord;
