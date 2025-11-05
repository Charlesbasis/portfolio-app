<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('education', function (Blueprint $table) {
            $table->enum('role', ['student', 'teacher'])->default('student')->after('user_id');
            
            // Rename fields to be more generic for both roles
            $table->renameColumn('degree', 'title');
            $table->renameColumn('field_of_study', 'field_or_department');
            
            // Add fields that might be useful for teachers
            $table->string('position')->nullable()->after('field_or_department');
            $table->text('responsibilities')->nullable()->after('description');
            
            // Add indexes
            $table->index('role');
            $table->index(['user_id', 'role']);
        });
        
        // Update the table comment to reflect the new purpose
        DB::statement("ALTER TABLE education COMMENT = 'Stores both educational experiences as student and teaching experiences as teacher'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('education', function (Blueprint $table) {
            $table->dropColumn('role');
            $table->dropColumn('position');
            $table->dropColumn('responsibilities');
            
            // Revert field names
            $table->renameColumn('title', 'degree');
            $table->renameColumn('field_or_department', 'field_of_study');
            
            // Drop indexes
            $table->dropIndex(['role']);
            $table->dropIndex(['user_id', 'role']);
        });
    }
};
