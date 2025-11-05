<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->enum('type', [
                'academic_project',
                'professional_project', 
                'personal_project',
                'research_paper',
                'assignment'
            ])->default('professional_project')->after('user_id');
            
            // Add index for better query performance
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('type');
            $table->dropIndex(['type']);
        });
    }
};
