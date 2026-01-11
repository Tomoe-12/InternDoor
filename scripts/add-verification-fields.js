// Migration script to add verification token fields
// Run with: node scripts/add-verification-fields.js

const path = require('path');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

if (!process.env.SUPABASE_DB_URL) {
  console.error('Missing SUPABASE_DB_URL in .env.local');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  console.log('Connecting to Supabase DB...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Adding verification_token to students table...');
    await client.query(`
      ALTER TABLE students 
      ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255)
    `);

    console.log('Adding verification_token_expiry to students table...');
    await client.query(`
      ALTER TABLE students 
      ADD COLUMN IF NOT EXISTS verification_token_expiry TIMESTAMP WITH TIME ZONE
    `);

    console.log('Adding university_id to students table...');
    await client.query(`
      ALTER TABLE students
      ADD COLUMN IF NOT EXISTS university_id VARCHAR(255)
    `);

    console.log('Adding verification_token to companies table...');
    await client.query(`
      ALTER TABLE companies 
      ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255)
    `);

    console.log('Adding verification_token_expiry to companies table...');
    await client.query(`
      ALTER TABLE companies 
      ADD COLUMN IF NOT EXISTS verification_token_expiry TIMESTAMP WITH TIME ZONE
    `);

    await client.query('COMMIT');
    console.log('✅ Migration completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
