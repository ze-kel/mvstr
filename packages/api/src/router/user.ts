import type { TRPCRouterRecord } from "@trpc/server";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { lucia } from "@acme/auth";
import { env, schema } from "@acme/db";

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

      const code = generateId(6).toUpperCase();

      const bdy = {
        text: `Место встречи: ${code}`,
        number: env.MTS_EXOLVE_NUMBER,
        destination: input,
      };

      console.log("env.ENABLE_SMS_CODES", env.ENABLE_SMS_CODES);

      if (env.ENABLE_SMS_CODES) {
        const res = await fetch("https://api.exolve.ru/messaging/v1/SendSMS", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.MTS_EXOLVE_TOKEN}`,
          },
          body: JSON.stringify(bdy),
        });
      }

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

      if (
        request.code !== input.code.toUpperCase() &&
        !(env.MASTER_CODE.length && env.MASTER_CODE == input.code.toUpperCase())
      ) {
        throw new Error("Wrong code");
      }

      await ctx.db
        .delete(schema.phoneTokenRequest)
        .where(eq(schema.phoneTokenRequest.phone, input.phone));

      const user = await ctx.db.query.userTable.findFirst({
        where: eq(schema.userTable.phone, request.phone),
      });

      if (user?.registered) {
        const session = await lucia.createSession(user.id, {});
        return {
          action: "auth" as const,
          token: session.id,
        };
      }

      const t = uuidv4();

      await ctx.db.insert(schema.phoneTokens).values({
        token: t,
        phone: input.phone,
        expiresAt: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
      });

      return {
        action: "register" as const,
        token: t,
      };
    }),

  createAccount: publicProcedure
    .input(
      z.object({
        registrationToken: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        gender: z.string(),
        avatar: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const phoneData = await ctx.db.query.phoneTokens.findFirst({
        where: eq(schema.phoneTokens.token, input.registrationToken),
      });

      if (!phoneData?.phone) {
        throw new Error("Wrong registration token");
      }

      if (phoneData.expiresAt < new Date()) {
        throw new Error("Expired registration token");
      }

      await ctx.db
        .delete(schema.phoneTokens)
        .where(eq(schema.phoneTokens.token, input.registrationToken));

      const existing = await ctx.db.query.userTable.findFirst({
        where: eq(schema.userTable.phone, phoneData.phone),
      });

      if (!existing) {
        const userId = generateId(15);
        await ctx.db.insert(schema.userTable).values({
          id: userId,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: phoneData.phone,
          gender: input.gender,
          profileImage: input.avatar,
          registered: true,
        });

        const session = await lucia.createSession(userId, {});
        return session.id;
      }

      await ctx.db
        .update(schema.userTable)
        .set({
          firstName: input.firstName,
          lastName: input.lastName,
          phone: phoneData.phone,
          gender: input.gender,
          registered: true,
          profileImage: input.avatar,
        })
        .where(eq(schema.userTable.id, existing.id));

      const session = await lucia.createSession(existing.id, {});
      return session.id;
    }),
  updateAccount: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        gender: z.string(),
        avatar: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(schema.userTable)
        .set({
          firstName: input.firstName,
          lastName: input.lastName,
          gender: input.gender,
          registered: true,
          profileImage: input.avatar,
        })
        .where(eq(schema.userTable.id, ctx.user.id));
    }),
} satisfies TRPCRouterRecord;
