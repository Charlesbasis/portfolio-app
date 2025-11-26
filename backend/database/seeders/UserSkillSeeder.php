<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserSkill;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();

        UserSkill::create([
            'user_id' => $user->id,
            'skill_id' => 1,
            'proficiency' => 1,
        ]);
    }
}
