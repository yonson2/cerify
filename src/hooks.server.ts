import { lucia } from "$lib/server/auth";
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
  event.locals.user = user;
  event.locals.session = session;


  // let's redirect logged-in users from going to the /login page.
  if (session && url.pathname === loginPath) {
    throw redirect(302, "/");
  }
  return resolve(event);
};

