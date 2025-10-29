<?php

namespace Database\Seeders;

use App\Models\Skills;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();

        Skills::create([
            'user_id' => $user->id,
            'name' => 'Laravel',
            'category' => 'backend',
            'proficiency' => 90,
            'slug' => 'laravel',
        ]);
    }
}
