<?php

namespace App\Http\Controllers;

use App\Models\UserType;
use Illuminate\Http\JsonResponse;

class UserTypeController extends Controller
{
    public function index(): JsonResponse
    {
        $userTypes = UserType::active()
            ->ordered()
            ->get()
            ->map(function ($userType) {
                return [
                    'id' => $userType->id,
                    'name' => $userType->name,
                    'slug' => $userType->slug,
                    'description' => $userType->description,
                    'config' => $userType->config,
                    'is_active' => $userType->is_active
                ];
            });

        return response()->json($userTypes);
    }
}
