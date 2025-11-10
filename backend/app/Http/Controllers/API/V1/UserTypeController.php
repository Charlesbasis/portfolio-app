<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\UserType;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class UserTypeController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $userTypes = UserType::with(['fields' => function($query) {
                $query->where('is_active', true);
            }])
            ->where('is_active', true)
            ->orderBy('display_order')
            ->get()
            ->map(function ($userType) {
                return [
                    'id' => $userType->id,
                    'name' => $userType->name,
                    'slug' => $userType->slug,
                    'description' => $userType->description,
                    'icon' => $userType->icon ?? 'Users',
                    'color' => $userType->color ?? 'blue',
                    'is_active' => $userType->is_active,
                    'fields' => $userType->fields->map(function($field) {
                        return [
                            'id' => $field->id,
                            'field_name' => $field->field_name,
                            'field_slug' => $field->field_slug,
                            'data_type' => $field->data_type,
                            'validation_rules' => $field->validation_rules,
                            'is_required' => (bool)$field->is_required,
                            'options' => $field->options ?? null,
                        ];
                    })
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $userTypes
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch user types: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user types'
            ], 500);
        }
    }
}
