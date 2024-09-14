import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { spotify, lucia } from "$lib/server/auth";
import { eq } from 'drizzle-orm';
import { usersTable, type InsertUser, type SelectUser } from "../../../../../db/schema";
import { db } from "$lib/server/drizzle";

import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
  const code = event.url.searchParams.get("code");
  const state = event.url.searchParams.get("state");
  const storedState = event.cookies.get("spotify_oauth_state") ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400
    });
  }

  try {
    const tokens = await spotify.validateAuthorizationCode(code);
    const spotifyUserResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    });
    const spotifyUser: SpotifyUser = await spotifyUserResponse.json();

    // Replace this with your own DB client.
    const existingUsers: SelectUser[] = await db.select().from(usersTable).where(eq(usersTable.spotifyId, spotifyUser.id));
    // const existingUser = await db.query.users.findFirst({ where: eq(usersTable.spotifyId, spotifyUser.id) });

    if (existingUsers.length > 0) {
      const session = await lucia.createSession(
        existingUsers[0].id,
        {
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          tokenExpiration: tokens.accessTokenExpiresAt
        }
      );
      const sessionCookie = lucia.createSessionCookie(session.id);
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes
      });
    } else {
      const userId = generateIdFromEntropySize(10); // 16 characters long

      const user: InsertUser = { id: userId, email: spotifyUser.email, spotifyId: spotifyUser.id }
      await db.insert(usersTable).values(user);

      const session = await lucia.createSession(
        userId,
        {
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          tokenExpiration: tokens.accessTokenExpiresAt
        }
      );
      const sessionCookie = lucia.createSessionCookie(session.id);
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes
      });
    }
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/"
      }
    });
  } catch (e) {
    console.error("New error came in: ", e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400
      });
    }
    return new Response(null, {
      status: 500
    });
  }
}

interface SpotifyUser {
  id: string;
  email: string;
}
