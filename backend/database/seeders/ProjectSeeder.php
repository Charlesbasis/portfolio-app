<?php

namespace Database\Seeders;

use App\Models\Projects;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();

        Projects::create([
            'user_id' => $user->id,
            'title' => 'E-Commerce Platform',
            'slug' => 'ecommerce-platform',
            'description' => 'A full-featured online shopping platform',
            'technologies' => ['Laravel', 'React', 'MySQL'],
            'featured' => true,
            'status' => 'published',
        ]);
    }
}
