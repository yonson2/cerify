import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable("user", {
  id: text("id").primaryKey(),
  spotifyId: text("spotify_id").unique().notNull(),
  email: text("email").unique().notNull(),
});

export const sessionsTable = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  expiresAt: integer("expires_at").notNull(),
  token: text("token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  tokenExpiration: integer("token_expiration", { mode: "timestamp" }).notNull(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertSession = typeof sessionsTable.$inferInsert;
export type SelectSession = typeof sessionsTable.$inferSelect;
