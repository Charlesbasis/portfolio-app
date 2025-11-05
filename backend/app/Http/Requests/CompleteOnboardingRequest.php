<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompleteOnboardingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = $this->user();
        $userType = $user->userType;

        if (!$userType) {
            return $userType->getValidationRules();
        }

        return [
            'user_type_id' => 'required|exists:user_types,id',
            'full_name' => 'required|string|max:255',
            'username' => [
                'required',
                'string',
                'alpha_dash',
                'max:255',
                Rule::unique('user_profiles', 'username')->ignore($user?->id, 'user_id')
            ],
            'email' => 'sometimes|email|max:255', // Add email validation
            'job_title' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'project.title' => 'required|string|max:255',
            'project.description' => 'required|string',
            'project.technologies' => 'nullable|array',
            'project.technologies.*' => 'string|max:255',
            'project.github_url' => 'nullable|url|max:255',
            'project.live_url' => 'nullable|url|max:255',

            // Student specific fields
            'grade_level' => 'sometimes|string|max:50',
            
            // Teacher specific fields  
            'subject_specialty' => 'sometimes|string|max:100',
            
            // Professional specific fields
            'current_role' => 'sometimes|string|max:100',
            'skills' => 'sometimes|array',
            'skills.*' => 'sometimes|string|max:100',
            
            // Freelancer specific fields
            'hourly_rate' => 'sometimes|integer|min:0',
            'portfolio_url' => 'sometimes|url|max:255',
            
            // Array fields for various types
            'courses' => 'sometimes|array',
            'courses.*.name' => 'sometimes|string|max:255',
            'courses.*.institution' => 'sometimes|string|max:255',
            'courses.*.start_date' => 'sometimes|date',
            'courses.*.end_date' => 'sometimes|date|after:courses.*.start_date',
            
            'subjects' => 'sometimes|array',
            'subjects.*.name' => 'sometimes|string|max:100',
            'subjects.*.level' => 'sometimes|string|max:50',
            
            'services' => 'sometimes|array',
            'services.*.name' => 'sometimes|string|max:255',
            'services.*.description' => 'sometimes|string',
            'services.*.category' => 'sometimes|string|max:100',
            'services.*.rate_type' => 'sometimes|string|max:50',
            'services.*.rate' => 'sometimes|numeric|min:0',
            
            'portfolio_projects' => 'sometimes|array',
            'portfolio_projects.*.title' => 'sometimes|string|max:255',
            'portfolio_projects.*.description' => 'sometimes|string',
            'portfolio_projects.*.client' => 'sometimes|string|max:255',
            'portfolio_projects.*.project_url' => 'sometimes|url|max:255',
            'portfolio_projects.*.technologies' => 'sometimes|array',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'user_type_id' => 'user type',
            'full_name' => 'full name',
            'job_title' => 'job title',
            'project.title' => 'project title',
            'project.description' => 'project description',
            'project.technologies' => 'project technologies',
            'project.github_url' => 'project GitHub URL',
            'project.live_url' => 'project live URL',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'user_type_id.exists' => 'Invalid user type',
            'username.unique' => 'This username is already taken. Please choose another one.',
            'project.title.required' => 'The project title is required.',
            'project.description.required' => 'The project description is required.',
            'courses.*.end_date.after' => 'The end date must be after the start date.',
            'hourly_rate.min' => 'Hourly rate must be a positive number.',
            'portfolio_url.url' => 'Please enter a valid URL for your portfolio.',
        ];
    }
}
