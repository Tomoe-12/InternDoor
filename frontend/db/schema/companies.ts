import { pgTable, serial, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  website: varchar('website', { length: 512 }),
  phoneNumber: varchar('phone_number', { length: 64 }),
  companyEmail: varchar('company_email', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  industry: varchar('industry', { length: 128 }),
  organizationSize: varchar('organization_size', { length: 64 }),
  organizationType: varchar('organization_type', { length: 64 }),
  logo: varchar('logo', { length: 512 }),
  address: varchar('address', { length: 512 }),
  description: text('description'),
  operatingHours: text('operating_hours'),
  linkedinProfile: varchar('linkedin_profile', { length: 512 }),
  verified: boolean('verified').default(false).notNull(),
  profileComplete: boolean('profile_complete').default(false).notNull(),
  employeeCount: varchar('employee_count', { length: 64 }),
  foundedYear: varchar('founded_year', { length: 64 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});