import { pgTable, serial, text, varchar, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const pushNotificationSubscriptions = pgTable('push_notification_subscriptions', {
  id: serial('id').primaryKey(),
  endpoint: text('endpoint').notNull(),
  p256dhKey: varchar('p256dh_key', { length: 255 }).notNull(),
  authKey: varchar('auth_key', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  endpointUnique: uniqueIndex('push_subs_endpoint_unique').on(table.endpoint),
}));