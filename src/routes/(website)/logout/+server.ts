import { redirect } from "@sveltejs/kit";
import { lucia } from "$lib/server/auth";

import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
  const session = event.locals.session;
  const user = event.locals.user;

  if (!session) {
    return new Response(null, {
      status: 400,
    });
  } else {
    await lucia.invalidateUserSessions(user.id)
    redirect(302, "/login");
  }

}
