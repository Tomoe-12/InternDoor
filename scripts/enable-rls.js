const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});

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
    await pool.query(`
      CREATE POLICY "companies_delete_policy" ON companies
        FOR DELETE
        USING (
          (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
        );
    `);
    console.log('✓ companies: admin-only modify policy added');

    // 4. Skills: Everyone can read, admin can modify
    await pool.query(`
      DROP POLICY IF EXISTS "skills_select_policy" ON skills;
      CREATE POLICY "skills_select_policy" ON skills
        FOR SELECT
        USING (true);
    `);
    console.log('✓ skills: select policy added');

    await pool.query(`
      DROP POLICY IF EXISTS "skills_modify_policy" ON skills;
      CREATE POLICY "skills_modify_policy" ON skills
        FOR UPDATE
        WITH CHECK (
          (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
        );
    `);
    await pool.query(`
      CREATE POLICY "skills_insert_policy" ON skills
        FOR INSERT
        WITH CHECK (
          (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
        );
    `);
    await pool.query(`
      CREATE POLICY "skills_delete_policy" ON skills
        FOR DELETE
        USING (
          (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
        );
    `);
    console.log('✓ skills: admin-only modify policy added');

    // 5. Student Skills: Students can view own, admin can view/modify all
    await pool.query(`
      DROP POLICY IF EXISTS "student_skills_select_policy" ON student_skills;
      CREATE POLICY "student_skills_select_policy" ON student_skills
        FOR SELECT
        USING (true);
    `);
    console.log('✓ student_skills: select policy added');

    await pool.query(`
      DROP POLICY IF EXISTS "student_skills_modify_policy" ON student_skills;
      CREATE POLICY "student_skills_modify_policy" ON student_skills
        FOR UPDATE
        WITH CHECK (
          (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
        );
    `);
    await pool.query(`
      CREATE POLICY "student_skills_insert_policy" ON student_skills
        FOR INSERT
        WITH CHECK (
          (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
        );
    `);
    await pool.query(`
      CREATE POLICY "student_skills_delete_policy" ON student_skills
        FOR DELETE
        USING (
          (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
        );
    `);
    console.log('✓ student_skills: admin-only modify policy added');

    // 6. Other tables: Admin only
    const adminOnlyTables = [
      'academic_years',
      'semesters',
      'subjects',
      'notifications',
      'password_reset_tokens',
      'user_connected_accounts',
      'uploaded_files',
      'push_notification_subscriptions',
      'verification_codes'
    ];

    for (const table of adminOnlyTables) {
      if (tables.includes(table)) {
        await pool.query(`
          DROP POLICY IF EXISTS "${table}_admin_policy" ON ${table};
          CREATE POLICY "${table}_admin_policy" ON ${table}
            FOR SELECT
            USING (
              (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
            );
        `);
        await pool.query(`
          CREATE POLICY "${table}_admin_insert" ON ${table}
            FOR INSERT
            WITH CHECK (
              (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
            );
        `);
        await pool.query(`
          CREATE POLICY "${table}_admin_update" ON ${table}
            FOR UPDATE
            WITH CHECK (
              (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
            );
        `);
        await pool.query(`
          CREATE POLICY "${table}_admin_delete" ON ${table}
            FOR DELETE
            USING (
              (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'admin'
            );
        `);
        console.log(`✓ ${table}: admin-only policy added`);
      }
    }

    console.log('\n✅ RLS setup complete!');
    await pool.end();
  } catch (error) {
    console.error('Error enabling RLS:', error.message);
    await pool.end();
  }
}

enableRLS();
