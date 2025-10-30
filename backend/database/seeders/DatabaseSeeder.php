<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory()->create([
        //     'name' => 'Admin User',
        //     'email' => 'admin@example.com',
        //     'password' => bcrypt('password'), // or Hash::make('password')
        // ]);

        // User::factory()->create([
        //     'name' => 'Admin User 2',
        //     'email' => 'admin2@example.com',
        //     'password' => 'password',
        // ]);

        $this->call([
            // ProjectSeeder::class,
            // SkillSeeder::class,
            // TestimonialSeeder::class,
            // ServiceSeeder::class,
            // UserDataSeeder::class,
            ProfileSeeder::class,
            // Add more seeders here as needed
        ]);

        
    }
}
