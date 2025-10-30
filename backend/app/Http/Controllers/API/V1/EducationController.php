<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\Education;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EducationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Education::where('user_id', $request->user()->id)
            ->orderBy('start_date', 'desc')
            ->orderBy('order');

        if ($request->has('current') && $request->current === 'true') {
            $query->current();
        }

        $education = $query->get();

        return response()->json([
            'success' => true,
            'data' => $education,
        ]);
    }

    /**
     * Get user's education (public).
     */
    public function userEducation($username)
    {
        $user = User::where('email', $username)
            ->orWhereHas('profile', function($query) use ($username) {
                $query->where('username', $username);
            })
            ->firstOrFail();

        $education = Education::where('user_id', $user->id)
            ->orderBy('start_date', 'desc')
            ->orderBy('order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $education,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'institution' => 'required|string|max:255',
            'degree' => 'required|string|max:255',
            'field_of_study' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_current' => 'boolean',
            'description' => 'nullable|string',
            'grade' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        $data['user_id'] = $request->user()->id;

        // If is_current is true, set end_date to null
        if (isset($data['is_current']) && $data['is_current']) {
            $data['end_date'] = null;
        }

        $education = Education::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Education created successfully',
            'data' => $education,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Education $education)
    {
        return response()->json([
            'success' => true,
            'data' => $education,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Education $education)
    {
        $validator = Validator::make($request->all(), [
            'institution' => 'string|max:255',
            'degree' => 'string|max:255',
            'field_of_study' => 'string|max:255',
            'start_date' => 'date',
            'end_date' => 'nullable|date|after:start_date',
            'is_current' => 'boolean',
            'description' => 'nullable|string',
            'grade' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // If is_current is true, set end_date to null
        if (isset($data['is_current']) && $data['is_current']) {
            $data['end_date'] = null;
        }

        $education->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Education updated successfully',
            'data' => $education,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Education $education)
    {
        $education->delete();

        return response()->json([
            'success' => true,
            'message' => 'Education deleted successfully',
        ]);
    }
}
