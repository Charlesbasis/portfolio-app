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

        // Professional Project
        Projects::create([
            'user_id' => $user->id,
            'title' => 'E-Commerce Platform',
            'slug' => 'ecommerce-platform',
            'description' => 'A full-featured online shopping platform',
            'long_description' => 'Built with modern technologies including Laravel, React, and MySQL. Features include user authentication, product management, shopping cart, and payment integration.',
            'technologies' => ['Laravel', 'React', 'MySQL', 'Stripe'],
            'type' => 'professional_project',
            'featured' => true,
            'status' => 'published',
            'github_url' => 'https://github.com/username/ecommerce-platform',
            'live_url' => 'https://ecommerce-demo.example.com',
        ]);

        // Academic Project
        Projects::create([
            'user_id' => $user->id,
            'title' => 'Machine Learning Research',
            'slug' => 'ml-research',
            'description' => 'Research project on neural network optimization',
            'long_description' => 'Conducted research on optimizing neural network architectures for better performance and efficiency. Published findings in academic journal.',
            'technologies' => ['Python', 'TensorFlow', 'Scikit-learn', 'Jupyter'],
            'type' => 'academic_project',
            'featured' => false,
            'status' => 'published',
            'github_url' => 'https://github.com/username/ml-research',
        ]);

        // Personal Project
        Projects::create([
            'user_id' => $user->id,
            'title' => 'Portfolio Website',
            'slug' => 'portfolio-website',
            'description' => 'Personal portfolio website built with modern stack',
            'technologies' => ['Laravel', 'Vue.js', 'Tailwind CSS'],
            'type' => 'personal_project',
            'featured' => true,
            'status' => 'published',
            'github_url' => 'https://github.com/username/portfolio',
            'live_url' => 'https://portfolio.example.com',
        ]);

        // Research Paper
        Projects::create([
            'user_id' => $user->id,
            'title' => 'AI in Healthcare: A Comprehensive Study',
            'slug' => 'ai-healthcare-study',
            'description' => 'Research paper on applications of AI in healthcare',
            'long_description' => 'Comprehensive study analyzing the impact of artificial intelligence in modern healthcare systems. Published in International Journal of Medical Informatics.',
            'technologies' => ['Research', 'Data Analysis', 'Python'],
            'type' => 'research_paper',
            'featured' => false,
            'status' => 'published',
            'live_url' => 'https://doi.org/10.1016/j.ijmedinf.2023.105123',
        ]);

        // Assignment
        Projects::create([
            'user_id' => $user->id,
            'title' => 'Database Design Project',
            'slug' => 'database-design-project',
            'description' => 'University assignment for database design course',
            'technologies' => ['MySQL', 'UML', 'Normalization'],
            'type' => 'assignment',
            'featured' => false,
            'status' => 'published',
            'github_url' => 'https://github.com/username/database-assignment',
        ]);
    }
}
