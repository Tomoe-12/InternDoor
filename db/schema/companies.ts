import { pgTable, serial, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  website: varchar('website', { length: 512 }),
  phoneNumber: varchar('phone_number', { length: 64 }),
  companyEmail: varchar('company_email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  verified: boolean('verified').default(false).notNull(),
  verificationToken: varchar('verification_token', { length: 255 }),
  verificationTokenExpiry: timestamp('verification_token_expiry', { withTimezone: true }),
  industry: varchar('industry', { length: 128 }),
  employeeCount: varchar('employee_count', { length: 64 }),
  foundedYear: varchar('founded_year', { length: 64 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});