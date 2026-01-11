import { db, endPool } from "../db/client";
import { sql } from "drizzle-orm";

async function applyMigration() {
  try {
    console.log("Applying verification token migration...");
    
    // Add columns to students table
    await db.execute(sql`
      ALTER TABLE students 
      ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255),
      ADD COLUMN IF NOT EXISTS verification_token_expiry TIMESTAMP WITH TIME ZONE;
    `);
    console.log("✓ Added verification fields to students table");
    
    // Add columns to companies table
    await db.execute(sql`
      ALTER TABLE companies 
      ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255),
      ADD COLUMN IF NOT EXISTS verification_token_expiry TIMESTAMP WITH TIME ZONE;
    `);
    console.log("✓ Added verification fields to companies table");
    
    console.log("Migration completed successfully!");
    await endPool();
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    await endPool();
    process.exit(1);
  }
}

applyMigration();
