import { cookies } from "next/headers";
import { generateState } from "arctic";

import { vkAuth } from "@acme/auth";

export async function GET(): Promise<Response> {
  const state = generateState();
  const url = await vkAuth.createAuthorizationURL(state);

  cookies().set("vk_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url);
}
