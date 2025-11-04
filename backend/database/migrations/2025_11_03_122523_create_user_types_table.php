<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_types', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // student, teacher, etc.
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->json('allowed_fields')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Insert default user types
        DB::table('user_types')->insert([
            [
                'name' => 'Student',
                'slug' => 'student',
                'description' => 'Currently studying',
                'allowed_fields' => json_encode(['gpa', 'major', 'graduation_year', 'current_semester']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Professional',
                'slug' => 'professional',
                'description' => 'Working professional',
                'allowed_fields' => json_encode(['current_role', 'skills', 'certifications', 'projects']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Teacher',
                'slug' => 'teacher',
                'description' => 'Educator or instructor',
                'allowed_fields' => json_encode(['teaching_subjects', 'education_level', 'certifications_count']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Freelancer',
                'slug' => 'freelancer',
                'description' => 'Independent contractor',
                'allowed_fields' => json_encode(['specialties', 'hourly_rate', 'portfolio_url']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('user_types');
    }
};
