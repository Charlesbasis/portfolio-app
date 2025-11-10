<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('user_types', function (Blueprint $table) {
            if (!Schema::hasColumn('user_types', 'icon')) {
                $table->string('icon')->default('Users')->after('description');
            }
            if (!Schema::hasColumn('user_types', 'color')) {
                $table->string('color')->default('blue')->after('icon');
            }
            if (!Schema::hasColumn('user_types', 'display_order')) {
                $table->integer('display_order')->default(0)->after('is_active');
            }
        });
    }

    public function down()
    {
        Schema::table('user_types', function (Blueprint $table) {
            $table->dropColumn(['icon', 'color', 'display_order']);
        });
    }
};
