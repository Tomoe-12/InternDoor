import { pgTable, serial, varchar, text, boolean, timestamp, numeric } from 'drizzle-orm/pg-core';

export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  fullName: varchar('full_name', { length: 255 }),
  verified: boolean('verified').default(false).notNull(),
  verificationToken: varchar('verification_token', { length: 255 }),
  verificationTokenExpiry: timestamp('verification_token_expiry', { withTimezone: true }),
  profileImageUrl: varchar('profile_image_url', { length: 512 }),
  role: varchar('role', { length: 64 }).default('STUDENT').notNull(),
  university: varchar('university', { length: 255 }),
  universityId: varchar('university_id', { length: 255 }), // For UNIVERSITY_ADMIN - tracks which university they manage
  status: varchar('status', { length: 64 }).default('Active').notNull(),
  overallGpa: numeric('overall_gpa', { precision: 3, scale: 2 }),
  yearOfStudy: varchar('year_of_study', { length: 64 }),
  universityStartYear: varchar('university_start_year', { length: 64 }),
  graduationYear: varchar('graduation_year', { length: 64 }),
  major: varchar('major', { length: 128 }),
  minor: varchar('minor', { length: 128 }),
  rememberToken: varchar('remember_token', { length: 255 }),
  twoFactorEnabled: boolean('two_factor_enabled').default(false).notNull(),
  interests: text('interests'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});