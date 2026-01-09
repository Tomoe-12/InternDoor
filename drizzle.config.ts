import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

// Load only .env.local for CLI tools (drizzle-kit)
dotenv.config({ path: '.env.local' });

export default defineConfig({
  dialect: 'postgresql',
  schema: './db/schema/**/*.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.SUPABASE_DB_URL!,
    ssl: { rejectUnauthorized: false },
  },
});