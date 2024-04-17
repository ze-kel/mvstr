import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";

import type { Session } from "@acme/auth";
import { lucia } from "@acme/auth";
import { db, schema } from "@acme/db";

import { env } from "~/env";

const getRedirect = (url: URL, session: Session) => {
  return url.searchParams.get("state")
    ? url.searchParams.get("state") + `token=${session.id}`
    : "/";
};

const getMoreInfo = async (token: string) => {
  const res = await fetch(
    "https://api.vk.com/method/account.getProfileInfo?v=5.199",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const { response } = await res.json();

  const { id, bdate, first_name, last_name, photo_200, sex } = response as {
    id: string;
    bdate: string;
    first_name: string;
    last_name: string;
    photo_200: string;
    sex: number;
  };

  const s = ["unknown", "female", "male"];

  return {
    id,
    bdate,
    first_name,
    last_name,
    photo_200,
    sex: s[sex] ?? "unknown",
  };
};

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);

  const storedState = cookies().get("vk_oauth_state")?.value ?? null;

  const payload = url.searchParams.get("payload");

  if (!payload) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const d = JSON.parse(payload) as {
      type: string;
      auth: 1 | 0;
      token: string;
      uuid: string;
    };

    if (d.uuid !== storedState) {
      return new Response(null, {
        status: 400,
      });
    }

    const res = await fetch(
      `https://api.vk.com/method/auth.exchangeSilentAuthToken?v=5.131&token=${d.token}&access_token=${env.VK_CLIENT_SECRET}&uuid=${d.uuid}`,
    );

    const { response } = await res.json();

    const { user_id, access_token, phone, email } = response as {
      user_id: string;
      access_token: string;
      phone: string;
      email: string;
    };

    const { bdate, first_name, last_name, photo_200, sex } =
      await getMoreInfo(access_token);

    const existingUser = await db.query.userTable.findFirst({
      where: eq(schema.userTable.vkId, user_id),
    });

    if (existingUser) {
      await db.update(schema.userTable).set({
        birthdayVk: bdate,
        firstName: first_name,
        lastName: last_name,
        profileImage: photo_200,
        vkConnected: true,
        vkAccessToken: access_token,
        gender: sex,
        phone,
        email,
      });

      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      const redirectTo = url.searchParams.get("state")
        ? url.searchParams.get("state") + `token=${session.id}`
        : "/";

      return new Response(null, {
        status: 302,
        headers: {
          Location: getRedirect(url, session),
        },
      });
    }

    const userId = generateId(15);

    await db.insert(schema.userTable).values({
      id: userId,
      vkId: user_id,
      birthdayVk: bdate,
      firstName: first_name,
      lastName: last_name,
      profileImage: photo_200,
      vkConnected: true,
      vkAccessToken: access_token,
      phone,
      email,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    const redirectTo = url.searchParams.get("state")
      ? url.searchParams.get("state") + `token=${session.id}`
      : "/";

    return new Response(null, {
      status: 302,
      headers: {
        Location: getRedirect(url, session),
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
