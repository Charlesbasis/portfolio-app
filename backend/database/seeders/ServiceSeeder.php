<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();

        Service::create([
            'user_id' => $user->id,
            'title' => 'Frontend Development',
            'description' => 'Creating responsive, modern user interfaces with React, Next.js, Vue.js, and cutting-edge CSS frameworks.',
            'features' => ['Responsive Design', 'Performance Optimization', 'Cross-browser Compatibility'],
        ]);
    }
}
