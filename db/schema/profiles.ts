import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  // References auth.users(id) in Supabase (not managed by Drizzle)
  userId: uuid('user_id').primaryKey(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  role: text('role').default('student'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
