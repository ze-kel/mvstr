import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { generateState } from "arctic";

import { env } from "~/env";

export async function GET(req: NextRequest): Promise<Response> {
  const reqUrl = new URL(req.url);
  const customRedirect = reqUrl.searchParams.get("customRedirect");

  const uuid = generateState();
  const appId = env.VK_CLIENT_ID;
  const redirectUri = env.VK_CALLBACK;
  const redirect_state = customRedirect ?? "/";

  const query = `uuid=${uuid}&app_id=${appId}&response_type=silent_token&redirect_uri=${redirectUri}&redirect_state=${redirect_state}`;

  const url = `https://id.vk.com/auth?${query}`;

  cookies().set("vk_oauth_state", uuid, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url);
}
