import { pgTable, serial, integer, varchar, timestamp } from 'drizzle-orm/pg-core';
import { semesters } from './semesters';

export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  semesterId: integer('semester_id').references(() => semesters.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 64 }).notNull(),
  grade: varchar('grade', { length: 8 }),
  credits: integer('credits'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});