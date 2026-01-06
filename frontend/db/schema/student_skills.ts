import { pgTable, serial, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { students } from './students';
import { skills } from './skills';

export const studentSkills = pgTable('student_skills', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull(),
  skillId: integer('skill_id').references(() => skills.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniq: uniqueIndex('student_skills_student_id_skill_id_unique').on(table.studentId, table.skillId),
}));