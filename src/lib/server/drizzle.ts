import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { usersTable, sessionsTable } from "../../db/schema";
import { db as database } from "../../db";
import { dev } from "$app/environment";
import type { LibSQLDatabase } from "drizzle-orm/libsql";

export const db: LibSQLDatabase = global.db || database
if (dev) {
  global.db = db;
}

export const adapter = new DrizzleSQLiteAdapter(db, sessionsTable, usersTable);

