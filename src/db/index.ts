import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { TURSO_AUTH_TOKEN, TURSO_CONNECTION_URL } from '$env/static/private';
import * as schema from './schema';

config({ path: '.env' }); // or .env.local

const client = createClient({
  url: TURSO_CONNECTION_URL,
  authToken: TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
