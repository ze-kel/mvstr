/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { TRPCRouterRecord } from "@trpc/server";
import { decode } from "base64-arraybuffer";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { env, supabase } from "@acme/db";

import { protectedProcedure } from "../trpc";

export const imagesRouter = {
  uploadImage: protectedProcedure
    .input(z.object({ file: z.string(), extension: z.string() }))
    .mutation(async ({ input }) => {
      console.log("mutation");

      const decoded = decode(input.file);

      const { data, error } = await supabase.storage
        .from("mv-wishes")
        .upload(uuidv4() + "." + input.extension, decoded, {
          contentType: `image/${input.extension}`,
        });

      console.log("SUPABSE ERROR", error);

      if (error) {
        throw new Error("error uploading");
      }

      return env.SUPABASE_BUCKET_URL + data.path;
    }),
} satisfies TRPCRouterRecord;
