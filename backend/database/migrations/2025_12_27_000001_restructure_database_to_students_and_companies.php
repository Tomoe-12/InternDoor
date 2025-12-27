<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Step 1: Create new students table with all fields (idempotent)
        if (!Schema::hasTable('students')) {
            Schema::create('students', function (Blueprint $table) {
                $table->id();
                $table->string('email')->unique();
                $table->string('password')->nullable();
                $table->string('full_name')->nullable();
                $table->string('name')->nullable();
                $table->string('surname')->nullable();
                $table->boolean('verified')->default(false);
                $table->string('profile_image_url')->nullable();
                $table->string('role')->default('STUDENT');
                $table->string('university')->nullable();
                $table->string('status')->default('Active');
                $table->decimal('overall_gpa', 3, 2)->nullable();
                $table->string('year_of_study')->nullable();
                $table->string('university_start_year')->nullable();
                $table->string('graduation_year')->nullable();
                $table->string('major')->nullable();
                $table->string('minor')->nullable();
                $table->string('remember_token')->nullable();
                $table->boolean('two_factor_enabled')->default(0);
                $table->text('interests')->nullable();
                $table->timestamps();
            });
        }

        // Step 2: Companies — avoid destructive rename on SQLite; ensure a companies table or view exists
        if (!Schema::hasTable('companies')) {
            if (Schema::hasTable('company')) {
                // Create a view alias 'companies' to 'company' to preserve existing FKs
                try {
                    DB::statement('CREATE VIEW companies AS SELECT * FROM company');
                } catch (\Throwable $e) {
                    // If views not supported or already exists, ignore
                }
            } else {
                Schema::create('companies', function (Blueprint $table) {
                    $table->id();
                    $table->string('company_name');
                    $table->string('website')->nullable();
                    $table->string('phone_number')->nullable();
                    $table->string('company_email')->unique();
                    $table->string('password');
                    $table->string('industry')->nullable();
                    $table->string('organization_size')->nullable();
                    $table->string('organization_type')->nullable();
                    $table->string('logo')->nullable();
                    $table->string('address')->nullable();
                    $table->text('description')->nullable();
                    $table->text('operating_hours')->nullable();
                    $table->string('linkedin_profile')->nullable();
                    $table->boolean('verified')->default(false);
                    $table->boolean('profile_complete')->default(false);
                    $table->string('employee_count')->nullable();
                    $table->string('founded_year')->nullable();
                    $table->timestamps();
                });
            }
        }

        // Step 3: Create skills table
        if (!Schema::hasTable('skills')) {
            Schema::create('skills', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
                $table->timestamps();
            });
        }

        // Step 4: Create student_skills junction table
        if (!Schema::hasTable('student_skills')) {
            Schema::create('student_skills', function (Blueprint $table) {
                $table->id();
                $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
                $table->foreignId('skill_id')->constrained('skills')->cascadeOnDelete();
                $table->timestamps();
                $table->unique(['student_id', 'skill_id']);
            });
        }

        // Step 5: Create academic_years table
        if (!Schema::hasTable('academic_years')) {
            Schema::create('academic_years', function (Blueprint $table) {
                $table->id();
                $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
                $table->string('year');
                $table->decimal('year_gpa', 3, 2)->nullable();
                $table->timestamps();
            });
        }

        // Step 6: Create semesters table
        if (!Schema::hasTable('semesters')) {
            Schema::create('semesters', function (Blueprint $table) {
                $table->id();
                $table->foreignId('academic_year_id')->constrained('academic_years')->cascadeOnDelete();
                $table->string('name');
                $table->string('start_date')->nullable();
                $table->string('end_date')->nullable();
                $table->decimal('gpa', 3, 2)->nullable();
                $table->timestamps();
            });
        }

        // Step 7: Create subjects table
        if (!Schema::hasTable('subjects')) {
            Schema::create('subjects', function (Blueprint $table) {
                $table->id();
                $table->foreignId('semester_id')->constrained('semesters')->cascadeOnDelete();
                $table->string('name');
                $table->string('code');
                $table->string('grade')->nullable();
                $table->integer('credits')->nullable();
                $table->timestamps();
            });
        }

        // Step 8: Update sessions table to reference students instead of users
        if (Schema::hasTable('sessions')) {
            Schema::table('sessions', function (Blueprint $table) {
                // Non-destructive: just add student_id if missing
                if (!Schema::hasColumn('sessions', 'student_id')) {
                    $table->foreignId('student_id')->nullable()->constrained('students')->cascadeOnDelete();
                }
            });
        }

        // Step 9: Update user_connected_accounts to link to both students and companies
        if (Schema::hasTable('user_connected_accounts')) {
            Schema::table('user_connected_accounts', function (Blueprint $table) {
                // Non-destructive: add student_id and company_id if missing
                if (!Schema::hasColumn('user_connected_accounts', 'student_id')) {
                    $table->foreignId('student_id')->nullable()->constrained('students')->cascadeOnDelete();
                }
                if (!Schema::hasColumn('user_connected_accounts', 'company_id')) {
                    $table->foreignId('company_id')->nullable()->constrained(Schema::hasTable('companies') ? 'companies' : 'company')->cascadeOnDelete();
                }
            });
        } else {
            Schema::create('user_connected_accounts', function (Blueprint $table) {
                $table->id();
                $table->foreignId('student_id')->nullable()->constrained('students')->cascadeOnDelete();
                $table->foreignId('company_id')->nullable()->constrained(Schema::hasTable('companies') ? 'companies' : 'company')->cascadeOnDelete();
                $table->string('provider');
                $table->string('provider_id');
                $table->timestamp('connected_at')->nullable();
                $table->timestamps();
            });
        }

        // Step 10: Update password_reset_tokens to link to both students and companies
        if (Schema::hasTable('password_reset_tokens')) {
            Schema::table('password_reset_tokens', function (Blueprint $table) {
                // Non-destructive: just add new FKs
                if (!Schema::hasColumn('password_reset_tokens', 'student_id')) {
                    $table->foreignId('student_id')->nullable()->constrained('students')->cascadeOnDelete();
                }
                if (!Schema::hasColumn('password_reset_tokens', 'company_id')) {
                    $table->foreignId('company_id')->nullable()->constrained(Schema::hasTable('companies') ? 'companies' : 'company')->cascadeOnDelete();
                }
            });
        } else {
            Schema::create('password_reset_tokens', function (Blueprint $table) {
                $table->id();
                $table->foreignId('student_id')->nullable()->constrained('students')->cascadeOnDelete();
                $table->foreignId('company_id')->nullable()->constrained(Schema::hasTable('companies') ? 'companies' : 'company')->cascadeOnDelete();
                $table->string('token');
                $table->boolean('email_sent')->default(false);
                $table->timestamp('expires_at')->nullable();
                $table->timestamps();
            });
        }

        // Step 11: Update verification_codes to ensure it has both student_id and company_id
        if (Schema::hasTable('verification_codes')) {
            Schema::table('verification_codes', function (Blueprint $table) {
                // Non-destructive: add student_id if missing
                if (!Schema::hasColumn('verification_codes', 'student_id')) {
                    $table->foreignId('student_id')->nullable()->constrained('students')->cascadeOnDelete();
                }
                // Ensure company_id exists and references the right table
                if (Schema::hasColumn('verification_codes', 'company_id')) {
                    // leave as-is; earlier migrations may point to company
                } else {
                    $table->foreignId('company_id')->nullable()->constrained(Schema::hasTable('companies') ? 'companies' : 'company')->cascadeOnDelete();
                }
            });
        } else {
            Schema::create('verification_codes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('student_id')->nullable()->constrained('students')->cascadeOnDelete();
                $table->foreignId('company_id')->nullable()->constrained(Schema::hasTable('companies') ? 'companies' : 'company')->cascadeOnDelete();
                $table->string('code');
                $table->boolean('email_sent')->default(false);
                $table->dateTime('expires_at');
                $table->timestamps();
            });
        }

        // Step 12: Create indexes for students table
        if (Schema::hasTable('students')) {
            // Create indexes with explicit names; guard per driver
            $createIndex = function (string $table, string $index, string $columns) {
                $driver = DB::getDriverName();
                $exists = false;
                if ($driver === 'sqlite') {
                    $list = DB::select("PRAGMA index_list('".$table."')");
                    foreach ($list as $row) {
                        if (isset($row->name) && $row->name === $index) { $exists = true; break; }
                    }
                }
                if (!$exists) {
                    DB::statement("CREATE INDEX IF NOT EXISTS $index ON $table($columns)");
                }
            };

            $createIndex('students', 'idx_students_email', 'email');
            $createIndex('students', 'idx_students_status', 'status');
            $createIndex('students', 'idx_students_university', 'university');
            $createIndex('students', 'idx_students_year_of_study', 'year_of_study');
        }

        // Step 13: Create indexes for academic and skill relationships
        $idx = function (string $table, string $index, string $cols) {
            $driver = DB::getDriverName();
            $exists = false;
            if ($driver === 'sqlite') {
                $list = DB::select("PRAGMA index_list('".$table."')");
                foreach ($list as $row) { if (isset($row->name) && $row->name === $index) { $exists = true; break; } }
            }
            if (!$exists) {
                DB::statement("CREATE INDEX IF NOT EXISTS $index ON $table($cols)");
            }
        };

        if (Schema::hasTable('student_skills')) { $idx('student_skills','idx_student_skills_student_id','student_id'); $idx('student_skills','idx_student_skills_skill_id','skill_id'); }
        if (Schema::hasTable('academic_years')) { $idx('academic_years','idx_academic_years_student_id','student_id'); }
        if (Schema::hasTable('semesters')) { $idx('semesters','idx_semesters_academic_year_id','academic_year_id'); }
        if (Schema::hasTable('subjects')) { $idx('subjects','idx_subjects_semester_id','semester_id'); }

        // Step 14: Create indexes for system tables
        if (Schema::hasTable('sessions')) { $idx('sessions','idx_sessions_student_id','student_id'); $idx('sessions','idx_sessions_last_activity','last_activity'); }

        if (Schema::hasTable('uploaded_files')) {
            Schema::table('uploaded_files', function (Blueprint $table) {
                if (!Schema::hasColumn('uploaded_files', 'student_id')) {
                    $table->foreignId('student_id')->nullable()->constrained('students')->cascadeOnDelete();
                }
            });
            $idx('uploaded_files','idx_uploaded_files_student_id','student_id');
        }

        if (Schema::hasTable('jobs')) { $idx('jobs','idx_jobs_queue_index','queue'); }

        if (Schema::hasTable('job_batches')) { $idx('job_batches','idx_job_batches_name','name'); }

        // Step 15: Create indexes for authentication and verification
        if (Schema::hasTable('user_connected_accounts')) { $idx('user_connected_accounts','idx_user_connected_accounts_student_id','student_id'); $idx('user_connected_accounts','idx_user_connected_accounts_company_id','company_id'); }

        if (Schema::hasTable('password_reset_tokens')) { $idx('password_reset_tokens','idx_password_reset_tokens_student_id','student_id'); $idx('password_reset_tokens','idx_password_reset_tokens_company_id','company_id'); }

        if (Schema::hasTable('verification_codes')) { $idx('verification_codes','idx_verification_codes_student_id','student_id'); $idx('verification_codes','idx_verification_codes_company_id','company_id'); }

        // Step 16: Optional clean-up of old users table (skip dropping to avoid breaking historical FKs)
    }

    public function down(): void
    {
        // Drop new tables in reverse order
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('semesters');
        Schema::dropIfExists('academic_years');
        Schema::dropIfExists('student_skills');
        Schema::dropIfExists('skills');

        // Restore old users table
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('password')->nullable();
            $table->string('full_name')->nullable();
            $table->boolean('verified')->default(false);
            $table->string('profile_image_url')->nullable();
            $table->string('role')->default('USER');
            $table->rememberToken();
            $table->timestamps();
        });

        // Drop view alias if created
        try { DB::statement('DROP VIEW IF EXISTS companies'); } catch (\Throwable $e) {}

        // Update back related tables
        if (Schema::hasTable('user_connected_accounts')) {
            Schema::table('user_connected_accounts', function (Blueprint $table) {
                $table->dropForeignKeyIfExists('user_connected_accounts_student_id_foreign');
                $table->dropForeignKeyIfExists('user_connected_accounts_company_id_foreign');
                $table->dropColumn(['student_id', 'company_id']);
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            });
        }

        if (Schema::hasTable('password_reset_tokens')) {
            Schema::table('password_reset_tokens', function (Blueprint $table) {
                $table->dropForeignKeyIfExists('password_reset_tokens_student_id_foreign');
                $table->dropForeignKeyIfExists('password_reset_tokens_company_id_foreign');
                $table->dropColumn(['student_id', 'company_id']);
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            });
        }

        if (Schema::hasTable('verification_codes')) {
            Schema::table('verification_codes', function (Blueprint $table) {
                $table->dropForeignKeyIfExists('verification_codes_student_id_foreign');
                $table->dropColumn('student_id');
                $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            });
        }

        Schema::dropIfExists('students');
    }
};
