import type { TRPCRouterRecord } from "@trpc/server";
import { eq } from "drizzle-orm";

import { schema } from "@acme/db";

import { protectedProcedure } from "../trpc";

export type IUser = typeof schema.userTable.$inferSelect;

export const userRouter = {
  getMe: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.userTable.findFirst({
      where: eq(schema.userTable.id, ctx.user.id),
    });
  }),
} satisfies TRPCRouterRecord;
