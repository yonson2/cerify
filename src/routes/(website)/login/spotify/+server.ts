import { redirect } from "@sveltejs/kit";
import { generateState } from "arctic";
import { lucia, spotify } from "$lib/server/auth";

import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
  const state = generateState();
  const url = await spotify.createAuthorizationURL(state, { scopes: ["user-read-private", "user-read-email"] });

  // TODO: this is pseudo-code and goes somewhere else.
  // if (event.locals.session) {
  //   const tokens = await spotify.refreshAccessToken(event.locals.session.refreshToken)
  //   const session = await lucia.createSession(event.locals.session.userId, { token: tokens.refreshToken });
  //   lucia.createSession(userId, attributes)
  // }

  event.cookies.set("spotify_oauth_state", state, {
    path: "/",
    secure: import.meta.env.PROD,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax"
  });

  redirect(302, url.toString());
}
