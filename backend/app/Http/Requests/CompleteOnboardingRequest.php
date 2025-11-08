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

        return [
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
            'skills' => 'nullable|array',
            'skills.*' => 'string|max:255',
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
            'username.unique' => 'This username is already taken. Please choose another one.',
            'project.title.required' => 'The project title is required.',
            'project.description.required' => 'The project description is required.',
        ];
    }
}
