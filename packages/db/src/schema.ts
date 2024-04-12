import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { boolean, pgTableCreator, text, timestamp } from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `PBXKK_${name}`);

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  phone: text("phone"),
  vkId: text("vk_id"),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImage: text("profile_image"),
  birthdayVk: text("birthday_vk"),
  vkConnected: boolean("vk_connected"),
  vkAccessToken: text("vk_token"),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const taskTable = pgTable("tasks", {
  eventId: text("id")
    .notNull()
    .references(() => eventTable.id),
  userId: text("userId")
    .notNull()
    .references(() => userTable.id),
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  time: timestamp("time"),
  completed: boolean("completed"),
  parentId: text("parent_id").references((): AnyPgColumn => taskTable.id),
});

export const eventTable = pgTable("events", {
  id: text("id").primaryKey(),
  // id владельца и создателя
  userId: text("userId")
    .notNull()
    .references(() => userTable.id),
  name: text("name").notNull(),
  type: text("type"),
  place: text("place"),
  date: timestamp("date"),
  time: text("time"),
  description: text("description"),
  image: text("image"),
});

export const guestsTable = pgTable("guests", {
  eventId: text("id")
    .notNull()
    .references(() => eventTable.id),
  type: text("type"),
  // Если мы приглашаем зареганного челика
  userId: text("userId").references(() => userTable.id),
  phone: text("phone"),
  role: text("role").default("guest"),
});

export type DbUserSelect = typeof userTable.$inferSelect;
export type DbEventSelect = typeof eventTable.$inferSelect;
export type DbEventInsert = typeof eventTable.$inferInsert;
