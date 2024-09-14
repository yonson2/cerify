import { lucia } from "$lib/server/auth";
import { refreshToken } from "$lib/server/spotify";
import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

const loginPath = "/login";
const publicPaths = ["/login"];

function isPathAllowed(path: string) {
  return publicPaths.some(allowedPath =>
    path === allowedPath || path.startsWith(allowedPath + '/')
  );
}

// export function handleError({ error }) {
//   console.error("AAAAAAAAAAAAAAAA");
//   console.error(error.stack);
//
//   return {
//     message: 'everything is fine',
//     code: 'JEREMYBEARIMY'
//   };
// }

export const handle: Handle = async ({ event, resolve }) => {
  const url = new URL(event.request.url);
  const sessionId = event.cookies.get(lucia.sessionCookieName);
  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;

    // now check if the route is protected.
    if (!isPathAllowed(url.pathname) && !publicPaths.includes(url.pathname)) {
      throw redirect(302, loginPath);
    }

    return resolve(event);
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    // sveltekit types deviates from the de-facto standard
    // you can use 'as any' too
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes
    });
  }
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes
    });
  }

  // the session may be valid but our spotify access token
  // doesn't last as long.
  if (session && user && session?.tokenExpiration < new Date()) {
    // NOTE: to simplify things I'm simply logging out the user,
    // check commit history for a way to sort of refresh the token
    // (sometimes)
    // we can't refresh anymore, logout.
    await lucia.invalidateUserSessions(user.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes
    });
    if (url.pathname === loginPath) {
      return resolve(event)
    } else {
      return resolve(event);
    }
  }

  event.locals.session = session
  event.locals.user = user;

  // let's redirect logged-in users from going to the /login page.
  if (session && url.pathname === loginPath) {
    throw redirect(302, "/");
  }
  return resolve(event);
};

