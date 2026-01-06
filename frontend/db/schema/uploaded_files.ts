import { pgTable, serial, integer, varchar, bigint, timestamp } from 'drizzle-orm/pg-core';
import { students } from './students';

export const uploadedFiles = pgTable('uploaded_files', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 1024 }),
  size: bigint('size', { mode: 'number' }),
  originalFileName: varchar('original_file_name', { length: 512 }),
  extension: varchar('extension', { length: 64 }),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});