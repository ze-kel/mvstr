import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";

import { lucia, vkAuth } from "@acme/auth";
import { db, schema } from "@acme/db";

export async function GET(request: Request): Promise<Response> {
  console.log("callback get");

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const storedState = cookies().get("vk_oauth_state")?.value ?? null;

  console.log("code", code, "state", state, "stored", storedState);
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await vkAuth.validateAuthorizationCode(code);

    const res = await fetch(
      "https://api.vk.com/method/account.getProfileInfo?v=5.199",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );

    const { response } = await res.json();

    const { id, bdate, first_name, last_name, photo_200 } = response as {
      id: string;
      bdate: string;
      first_name: string;
      last_name: string;
      photo_200: string;
    };

    const existingUser = await db.query.userTable.findFirst({
      where: eq(schema.userTable.vkId, id),
    });

    if (existingUser) {
      await db.update(schema.userTable).set({
        birthdayVk: bdate,
        firstName: first_name,
        lastName: last_name,
        profileImage: photo_200,
        vkConnected: true,
      });

      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/app",
        },
      });
    }

    const userId = generateId(15);

    await db.insert(schema.userTable).values({
      id: userId,
      vkId: id,
      birthdayVk: bdate,
      firstName: first_name,
      lastName: last_name,
      profileImage: photo_200,
      vkConnected: true,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    console.log("error", e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
