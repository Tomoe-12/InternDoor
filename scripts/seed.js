// Simple seeding script for Supabase Postgres via Drizzle/pg
// Run with: npm run db:seed

const path = require('path');
// For local development only: relax TLS cert verification for Supabase
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const dotenv = require('dotenv');
const { Pool } = require('pg');

// Load env from .env.local within frontend
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

if (!process.env.SUPABASE_DB_URL) {
  console.error('Missing SUPABASE_DB_URL in .env.local');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});

async function seed() {
  console.log('Connecting to Supabase DB...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Seed skills
    const skills = [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'PostgreSQL',
      'Tailwind CSS',
      'Zod',
      'Next.js',
    ];

    for (const name of skills) {
      await client.query(
        'INSERT INTO skills (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
        [name]
      );
    }

    // Seed companies
    const companies = [
      {
        company_name: 'Tech Corp',
        company_email: 'contact@techcorp.test',
        password: 'hashed-password',
        industry: 'Software',
        organization_size: '51-200',
        organization_type: 'Private',
        website: 'https://techcorp.example',
        phone_number: '+1 555-0100',
        logo: '/test/tech-company-logo.jpg',
        address: '123 Innovation Way',
        description: 'Leading provider of modern web solutions.',
        operating_hours: 'Mon-Fri 9:00-17:00',
        linkedin_profile: 'https://linkedin.com/company/techcorp',
        verified: true,
        profile_complete: true,
        employee_count: '120',
        founded_year: '2018',
      },
      {
        company_name: 'Consulting Co',
        company_email: 'hello@consultingco.test',
        password: 'hashed-password',
        industry: 'Consulting',
        organization_size: '11-50',
        organization_type: 'Private',
        website: 'https://consultingco.example',
        phone_number: '+1 555-0200',
        logo: '/test/consulting-company-logo.png',
        address: '456 Strategy Ave',
        description: 'Consulting boutique for startups.',
        operating_hours: 'Mon-Fri 10:00-18:00',
        linkedin_profile: 'https://linkedin.com/company/consultingco',
        verified: false,
        profile_complete: false,
        employee_count: '35',
        founded_year: '2020',
      },
    ];

    const companyIds = [];
    for (const c of companies) {
      const { rows } = await client.query(
        `INSERT INTO companies
        (company_name, website, phone_number, company_email, password, industry,
         organization_size, organization_type, logo, address, description, operating_hours,
         linkedin_profile, verified, profile_complete, employee_count, founded_year)
         VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
        RETURNING id`,
        [
          c.company_name,
          c.website,
          c.phone_number,
          c.company_email,
          c.password,
          c.industry,
          c.organization_size,
          c.organization_type,
          c.logo,
          c.address,
          c.description,
          c.operating_hours,
          c.linkedin_profile,
          c.verified,
          c.profile_complete,
          c.employee_count,
          c.founded_year,
        ]
      );
      companyIds.push(rows[0].id);
    }

    // Seed students
    const students = [
      {
        email: 'alice@example.test',
        password: 'hashed-password',
        full_name: 'Alice Johnson',
        verified: true,
        profile_image_url: '/test/professional-woman-diverse.png',
        role: 'STUDENT',
        university: 'State University',
        status: 'Active',
        overall_gpa: 3.7,
        year_of_study: '3',
        university_start_year: '2023',
        graduation_year: '2027',
        major: 'Computer Science',
        minor: 'Mathematics',
        interests: 'Web development, UI/UX'
      },
      {
        email: 'bob@example.test',
        password: 'hashed-password',
        full_name: 'Bob Smith',
        verified: false,
        profile_image_url: '/test/placeholder-user.jpg',
        role: 'STUDENT',
        university: 'Tech Institute',
        status: 'Active',
        overall_gpa: 3.2,
        year_of_study: '2',
        university_start_year: '2024',
        graduation_year: '2028',
        major: 'Information Systems',
        minor: 'Business',
        interests: 'APIs, data viz'
      }
    ];

    const studentIds = [];
    for (const s of students) {
      const { rows } = await client.query(
        `INSERT INTO students
        (email, password, full_name, verified, profile_image_url, role, university, status,
         overall_gpa, year_of_study, university_start_year, graduation_year, major, minor, interests)
         VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
        RETURNING id`,
        [
          s.email,
          s.password,
          s.full_name,
          s.verified,
          s.profile_image_url,
          s.role,
          s.university,
          s.status,
          s.overall_gpa,
          s.year_of_study,
          s.university_start_year,
          s.graduation_year,
          s.major,
          s.minor,
          s.interests,
        ]
      );
      studentIds.push(rows[0].id);
    }

    // Map some skills to students
    const { rows: skillRows } = await client.query('SELECT id, name FROM skills WHERE name = ANY($1::text[])', [skills]);
    const skillMap = new Map(skillRows.map(r => [r.name, r.id]));

    const mappings = [
      { studentId: studentIds[0], skillNames: ['JavaScript', 'React', 'Next.js'] },
      { studentId: studentIds[1], skillNames: ['TypeScript', 'PostgreSQL', 'Node.js'] },
    ];

    for (const m of mappings) {
      for (const sn of m.skillNames) {
        const skillId = skillMap.get(sn);
        if (!skillId) continue;
        await client.query(
          `INSERT INTO student_skills (student_id, skill_id)
           VALUES ($1, $2)
           ON CONFLICT (student_id, skill_id) DO NOTHING`,
          [m.studentId, skillId]
        );
      }
    }

    await client.query('COMMIT');

    console.log('Seed completed:', {
      companies: companyIds.length,
      students: studentIds.length,
      skills: skills.length,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err?.message || err);
    if (err?.stack) console.error(err.stack);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
