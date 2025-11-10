<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('user_type_fields', function (Blueprint $table) {
            if (!Schema::hasColumn('user_type_fields', 'placeholder')) {
                $table->string('placeholder')->nullable()->after('validation_rules');
            }
            if (!Schema::hasColumn('user_type_fields', 'description')) {
                $table->text('description')->nullable()->after('placeholder');
            }
            if (!Schema::hasColumn('user_type_fields', 'options')) {
                $table->json('options')->nullable()->after('description');
            }
            if (!Schema::hasColumn('user_type_fields', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('options');
            }
            if (!Schema::hasColumn('user_type_fields', 'display_order')) {
                $table->integer('display_order')->default(0)->after('is_active');
            }
        });
    }

    public function down()
    {
        Schema::table('user_type_fields', function (Blueprint $table) {
            $table->dropColumn(['placeholder', 'description', 'options', 'is_active', 'display_order']);
        });
    }
};
