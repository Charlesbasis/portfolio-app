<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();

        Testimonial::create([
            'user_id' => $user->id,
            'name' => 'John Doe',
            'role' => 'CEO',
            'category' => 'client',
            'content' => 'Outstanding work! Delivered our project on time with exceptional quality. Highly recommend!',
            'avatar_url' => 'https://via.placeholder.com/150',
        ]);
    }
}
