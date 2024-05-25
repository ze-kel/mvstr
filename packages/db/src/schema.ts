import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { boolean, pgTableCreator, text, timestamp } from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `PBXKK_${name}`);

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  phone: text("phone").unique(),
  vkId: text("vk_id"),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImage: text("profile_image"),
  birthdayVk: text("birthday_vk"),
  gender: text("gender"),
  vkConnected: boolean("vk_connected"),
  vkAccessToken: text("vk_token"),
  registered: boolean("registered"),
});

export const eventTable = pgTable("events", {
  id: text("id").primaryKey(),
  // id владельца и создателя
  userId: text("userId")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type"),
  place: text("place"),
  date: timestamp("date").notNull(),
  time: text("time"),
  description: text("description"),
  image: text("image"),
  reminder: timestamp("reminder_date"),
  reminderText: text("reminder_text"),
  reminderSent: boolean("reminder_sent"),
});

export const guestsTable = pgTable("guests", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .notNull()
    .references(() => eventTable.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  role: text("role").default("guest"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  gender: text("gender"),
  reminderDate: timestamp("reminder_date", {
    withTimezone: true,
    mode: "date",
  }),
  status: text("status"),
});

export const userRelations = relations(userTable, ({ many }) => ({
  events: many(guestsTable),
}));

export const eventRelations = relations(eventTable, ({ many, one }) => ({
  guests: many(guestsTable),
  wishes: many(wishConnectionsTable),
  user: one(userTable, {
    fields: [eventTable.userId],
    references: [userTable.id],
  }),
}));

export const guestRelations = relations(guestsTable, ({ one }) => ({
  event: one(eventTable, {
    fields: [guestsTable.eventId],
    references: [eventTable.id],
  }),
  user: one(userTable, {
    fields: [guestsTable.userId],
    references: [userTable.id],
  }),
}));

export const wishConnectionsTable = pgTable("wishconnections", {
  id: text("id").primaryKey(),
  wishId: text("wish_id").references(() => wishTable.id, {
    onDelete: "cascade",
  }),
  eventId: text("event_id").references(() => eventTable.id, {
    onDelete: "cascade",
  }),
  status: text("status"),
});

export const wishRelations = relations(wishConnectionsTable, ({ one }) => ({
  event: one(eventTable, {
    fields: [wishConnectionsTable.eventId],
    references: [eventTable.id],
  }),
  wish: one(wishTable, {
    fields: [wishConnectionsTable.wishId],
    references: [wishTable.id],
  }),
}));

export const wishTable = pgTable("wishes", {
  id: text("id").primaryKey(),
  userId: text("userId").references(() => userTable.id),
  link: text("link"),
  image: text("image_url"),
  title: text("title"),
  price: text("price"),
  description: text("descriptions"),
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
    .references(() => eventTable.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  time: timestamp("time"),
  completed: boolean("completed"),
  parentId: text("parent_id").references((): AnyPgColumn => taskTable.id),
});
