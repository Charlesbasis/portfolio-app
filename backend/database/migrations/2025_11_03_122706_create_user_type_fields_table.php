<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_type_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_type_id')->constrained()->onDelete('cascade');
            $table->string('field_name');
            $table->string('field_slug');
            $table->string('data_type'); // string, text, integer, boolean, etc.
            $table->text('validation_rules')->nullable();
            $table->boolean('is_required')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_type_fields');
    }
};
