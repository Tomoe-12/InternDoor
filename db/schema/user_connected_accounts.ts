import { pgTable, serial, integer, varchar, timestamp } from 'drizzle-orm/pg-core';
import { students } from './students';
import { companies } from './companies';

export const userConnectedAccounts = pgTable('user_connected_accounts', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'cascade' }),
  companyId: integer('company_id').references(() => companies.id, { onDelete: 'cascade' }),
  provider: varchar('provider', { length: 64 }).notNull(),
  providerId: varchar('provider_id', { length: 255 }).notNull(),
  connectedAt: timestamp('connected_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});