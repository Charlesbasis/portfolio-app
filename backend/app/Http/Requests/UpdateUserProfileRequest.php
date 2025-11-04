<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserProfileRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'user_type_id' => 'nullable|exists:user_types,id',
            'job_title' => 'nullable|string|max:100',
            'company' => 'nullable|string|max:100',
            'years_experience' => 'nullable|integer|min:0|max:50',
            'headline' => 'nullable|string|max:200',
            'current_status' => 'nullable|in:studying,working,teaching,freelancing,researching,unemployed,seeking_opportunities,other',
            'institution' => 'nullable|string|max:100',
            'field_of_interest' => 'nullable|string|max:100',
            'custom_fields' => 'nullable|array',
        ];
    }

    public function messages()
    {
        return [
            'user_type_id.exists' => 'The selected user type is invalid.',
            'current_status.in' => 'The selected status is invalid.',
        ];
    }
}
