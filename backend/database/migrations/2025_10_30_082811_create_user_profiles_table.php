<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('username')->unique();
            $table->string('full_name');
            $table->string('tagline', 500)->nullable();
            $table->text('bio')->nullable();
            $table->string('location')->nullable();
            $table->string('website')->nullable();
            $table->string('avatar_url')->nullable();
            $table->string('cover_image_url')->nullable();
            
            // Social Links
            $table->string('github_url')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('twitter_url')->nullable();
            
            // Contact
            $table->string('email');
            $table->string('phone', 20)->nullable();
            
            // Professional
            $table->string('job_title')->nullable();
            $table->string('company')->nullable();
            $table->integer('years_experience')->nullable();
            $table->enum('availability_status', ['available', 'busy', 'not_available'])->default('available');
            
            // Stats
            $table->integer('profile_views')->default(0);
            
            // Settings
            $table->boolean('is_public')->default(false);
            $table->boolean('show_email')->default(false);
            $table->boolean('show_phone')->default(false);
            
            $table->timestamps();
            
            $table->index('username');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
