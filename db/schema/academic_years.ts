import { pgTable, serial, integer, varchar, timestamp, numeric } from 'drizzle-orm/pg-core';
import { students } from './students';

export const academicYears = pgTable('academic_years', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull(),
  year: varchar('year', { length: 64 }).notNull(),
  yearGpa: numeric('year_gpa', { precision: 3, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});