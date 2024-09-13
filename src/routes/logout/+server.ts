import { redirect } from "@sveltejs/kit";
import { lucia } from "$lib/server/auth";

import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
  const session = event.locals.session;

  if (!session) {
    return new Response(null, {
      status: 400,
    });
  } else {
    await lucia.invalidateSession(session.id)
    redirect(302, "/login");
  }

}
