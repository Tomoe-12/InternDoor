import { pgTable, serial, integer, varchar, timestamp, numeric } from 'drizzle-orm/pg-core';
import { academicYears } from './academic_years';

export const semesters = pgTable('semesters', {
  id: serial('id').primaryKey(),
  academicYearId: integer('academic_year_id').references(() => academicYears.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 64 }).notNull(),
  startDate: varchar('start_date', { length: 64 }),
  endDate: varchar('end_date', { length: 64 }),
  gpa: numeric('gpa', { precision: 3, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});