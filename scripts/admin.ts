import { supabase } from '../lib/supabase';
import { db } from '../db/client';
import { profiles } from '../db/schema/profiles';
import { hashPassword } from '../server/lib/password';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load env from .env.local
dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});

/**
 * Creates an admin user in the auth system and profiles table
 */
async function createAdminUser() {
  try {
    console.log('Creating admin user...');

    // Import supabase client after env is loaded
    const { supabase } = await import('../lib/supabase');

    // 1. Create auth user in Supabase
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: 'admin@email.com',
      password: 'Password123',
    });

    if (authError) {
      console.error('Auth error:', authError);
      return;
    }

    if (!authUser.user) {
      console.error('No user returned from auth.signUp');
      return;
    }

    const userId = authUser.user.id;
    console.log('✓ Auth user created:', userId);

    // 2. Create profile with admin role
    const adminProfile = await db.insert(profiles).values({
      userId,
      fullName: 'Admin User',
      role: 'admin',
    }).returning();

    console.log('✓ Admin profile created:', adminProfile);
    console.log('\n✅ Admin user created successfully!');
    console.log(`Email: admin@email.com`);
    console.log(`Password: Password123`);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

/**
 * Creates an admin user in the students table
 */
async function createAdminStudent() {
  try {
    console.log('Creating admin in students table...\n');

    // Insert admin into students table
    const query = `
      INSERT INTO students (
        email,
        password,
        full_name,
        verified,
        role,
        status,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET
        password = EXCLUDED.password,
        full_name = EXCLUDED.full_name,
        verified = EXCLUDED.verified,
        role = EXCLUDED.role,
        status = EXCLUDED.status,
        updated_at = NOW()
      RETURNING *;
    `;

    // Hash the password to match AuthService.verifyPassword
    const hashed = await hashPassword('Password123');

    const result = await pool.query(query, [
      'admin@example.com',
      hashed,
      'Admin User',
      true,
      'ADMIN',
      'Active'
    ]);

    console.log('✓ Admin created in students table:');
    console.log(result.rows[0]);
    console.log('\n✅ Admin student created successfully!');
    console.log(`Email: admin@example.com`);
    console.log(`Password: Password123`);
    console.log(`Role: ADMIN`);

    await pool.end();
  } catch (error) {
    console.error('Error creating admin student:', error);
  }
}

/**
 * Enables Row Level Security (RLS) on all tables and adds basic RLS policies
 */
async function enableRLS() {
  try {
    console.log('Enabling RLS on all tables...\n');

    // Get all tables in public schema
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    const tables = tablesResult.rows.map(row => row.table_name);
    console.log(`Found ${tables.length} tables:`, tables, '\n');

    // Enable RLS for each table
    for (const table of tables) {
      await pool.query(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);
      // Drop all existing policies
      await pool.query(`
        DO $$ DECLARE
          r RECORD;
        BEGIN
          FOR r IN SELECT policyname FROM pg_policies WHERE tablename = '${table}'
          LOOP
            EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ${table}';
          END LOOP;
        END $$;
      `);
      console.log(`✓ RLS enabled on ${table}`);
    }

    console.log('\n---\nAdding basic RLS policies...\n');

    // 1. Profiles: Users can see their own profile + admins see all
    await pool.query(`
      DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
      CREATE POLICY "profiles_select_policy" ON profiles
        FOR SELECT
        USING (
          auth.uid() = user_id OR 
          (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
        );
    `);
    console.log('✓ profiles: select policy added');

    await pool.query(`
      DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
      CREATE POLICY "profiles_update_policy" ON profiles
        FOR UPDATE
        USING (
          auth.uid() = user_id OR 
          (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
        );
    `);
    console.log('✓ profiles: update policy added');

    // 2. Students: Everyone can read, admin can modify
    await pool.query(`
      DROP POLICY IF EXISTS "students_select_policy" ON students;
      CREATE POLICY "students_select_policy" ON students
        FOR SELECT
        USING (true);
    `);
    console.log('✓ students: select policy added');

    await pool.query(`
      DROP POLICY IF EXISTS "students_modify_policy" ON students;
      CREATE POLICY "students_modify_policy" ON students
        FOR UPDATE
        WITH CHECK (
          (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
        );
    `);
    await pool.query(`
      CREATE POLICY "students_insert_policy" ON students
        FOR INSERT
        WITH CHECK (
          (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
        );
    `);
    await pool.query(`
      CREATE POLICY "students_delete_policy" ON students
        FOR DELETE
        USING (
          (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
        );
    `);
    console.log('✓ students: admin-only modify policy added');

    // 3. Companies: Everyone can read, admin can modify
    await pool.query(`
      DROP POLICY IF EXISTS "companies_select_policy" ON companies;
      CREATE POLICY "companies_select_policy" ON companies
        FOR SELECT
        USING (true);
    `);
    console.log('✓ companies: select policy added');

    await pool.query(`
      DROP POLICY IF EXISTS "companies_modify_policy" ON companies;
      CREATE POLICY "companies_modify_policy" ON companies
        FOR UPDATE
        WITH CHECK (
          (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
        );
    `);
    await pool.query(`
      CREATE POLICY "companies_insert_policy" ON companies
        FOR INSERT
        WITH CHECK (
          (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
        );
    `);
    console.log('✓ companies: admin-only modify policy added');

    console.log('\n✅ RLS enabled and policies created successfully!');
    await pool.end();
  } catch (error) {
    console.error('Error enabling RLS:', error);
    await pool.end();
  }
}

/**
 * CLI Interface - run admin commands
 * Usage: npx ts-node scripts/admin.ts [command]
 * 
 * Commands:
 *   create-admin-user     - Create admin user in auth and profiles
 *   create-admin-student  - Create admin in students table
 *   enable-rls            - Enable RLS on all tables
 *   all                   - Run all commands in sequence
 */
async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'create-admin-user':
      await createAdminUser();
      break;
    case 'create-admin-student':
      await createAdminStudent();
      break;
    case 'enable-rls':
      await enableRLS();
      break;
    case 'all':
      await createAdminUser();
      await createAdminStudent();
      await enableRLS();
      break;
    default:
      console.log(`
Admin Utility Commands:
  npx ts-node scripts/admin.ts create-admin-user    - Create admin user in auth/profiles
  npx ts-node scripts/admin.ts create-admin-student - Create admin in students table
  npx ts-node scripts/admin.ts enable-rls           - Enable RLS on all tables
  npx ts-node scripts/admin.ts all                  - Run all commands
      `);
  }
}

main().catch(console.error);
