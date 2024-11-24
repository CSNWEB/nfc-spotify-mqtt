import { sql } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";

export const tag_assignments = t.sqliteTable("tag_assignments", {
  id: t.integer().primaryKey({ autoIncrement: true }),
  tag_id: t.text().notNull().unique(),
  name: t.text(),
  spotify_type: t.text({ enum: ["track", "album", "playlist"] }),
  spotify_id: t.text(),
  spotify_image: t.text(),
  created_at: t.text().default(sql`(datetime('now'))`),
  updated_at: t.text().default(sql`(datetime('now'))`),
});

export const api_keys = t.sqliteTable("api_keys", {
  id: t.integer().primaryKey(),
  service: t.text().unique().notNull(),
  key: t.text(),
  secret: t.text(),
});
