<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('user_profiles', function (Blueprint $table) {
            // Make existing fields nullable
            $table->string('job_title')->nullable()->change();
            $table->string('company')->nullable()->change();
            $table->integer('years_experience')->nullable()->change();

            // Add new universal fields
            $table->foreignId('user_type_id')->nullable()->constrained()->onDelete('set null');
            $table->string('headline')->nullable();
            $table->enum('current_status', [
                'studying', 
                'working', 
                'teaching', 
                'freelancing', 
                'researching',
                'unemployed',
                'seeking_opportunities',
                'other'
            ])->nullable();
            $table->string('institution')->nullable();
            $table->string('field_of_interest')->nullable();
            
            // Add JSON field for custom data
            $table->json('custom_fields')->nullable();
            
            // Indexes for better performance
            $table->index('user_type_id');
            $table->index('current_status');
        });
    }

    public function down()
    {
        Schema::table('user_profiles', function (Blueprint $table) {
            // Revert nullable fields (adjust based on your original state)
            $table->string('job_title')->nullable(false)->change();
            $table->string('company')->nullable(false)->change();
            $table->integer('years_experience')->nullable(false)->change();

            // Remove new fields
            $table->dropForeign(['user_type_id']);
            $table->dropColumn([
                'user_type_id',
                'headline',
                'current_status',
                'institution',
                'field_of_interest',
                'custom_fields'
            ]);
        });
    }
};
