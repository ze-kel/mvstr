import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { generateState } from "arctic";

import { vkAuth } from "@acme/auth";

export async function GET(req: NextRequest): Promise<Response> {
  const reqUrl = new URL(req.url);
  const customRedirect = reqUrl.searchParams.get("customRedirect");

  console.log("custom redirect", customRedirect);

  const state = generateState();

  const url = await vkAuth.createAuthorizationURL(state);

  cookies().set("vk_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });
  if (customRedirect) {
    cookies().set("vk_custom_redirect", customRedirect, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    });
  }
  return Response.redirect(url);
}
