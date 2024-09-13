import { Lucia } from "lucia";
import { dev } from "$app/environment";

import { prisma } from "$lib/server/prisma";

import { Spotify } from "arctic";
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } from "$env/static/private";

export const spotify = new Spotify(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI);


export const lucia = new Lucia(prisma, {
  sessionCookie: {
    attributes: {
      secure: !dev
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      spotifyId: attributes.spotify_id,
      email: attributes.email
    };
  }

});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
  }
}

interface DatabaseUserAttributes {
  spotify_id: string;
  email: string;
}

interface DatabaseSessionAttributes {
  token: string;
}


