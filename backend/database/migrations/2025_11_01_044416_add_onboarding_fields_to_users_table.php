<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('onboarding_completed')->default(false);
            // $table->boolean('onboarding_completed')->default(false)->after('email_verified_at');
            $table->timestamp('onboarding_completed_at')->nullable();
            $table->json('onboarding_data')->nullable(); // Store onboarding progress
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'onboarding_completed',
                'onboarding_completed_at', 
                'onboarding_data'
            ]);
        });
    }
};
