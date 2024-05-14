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
  gender: text("gender"),
  vkConnected: boolean("vk_connected"),
  vkAccessToken: text("vk_token"),
});

export const phoneTokenRequest = pgTable("phoneverification", {
  phone: text("phone").primaryKey(),
  code: text("code"),
  expiresAt: timestamp("requested_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const phoneTokens = pgTable("phonetokens", {
  token: text("token").primaryKey(),
  phone: text("phone"),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
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
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .notNull()
    .references(() => eventTable.id),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
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
  id: text("id").primaryKey(),
  eventId: text("id")
    .notNull()
    .references(() => eventTable.id),
  type: text("type"),
  phone: text("phone"),
  role: text("role").default("guest"),
});

export const wishTable = pgTable("wishes", {
  id: text("id").primaryKey(),
  userId: text("userId").references(() => userTable.id),
  link: text("link"),
  image: text("image_url"),
  title: text("title"),
  price: text("price"),
  description: text("descriptions"),
});
