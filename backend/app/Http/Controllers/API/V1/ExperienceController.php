<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;

use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExperienceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Experience::query()
            ->orderBy('start_date', 'desc')
            ->orderBy('order');

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('current') && $request->current === 'true') {
            $query->current();
        }

        $experiences = $query->get();

        return response()->json([
            'success' => true,
            'data' => $experiences,
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_current' => 'boolean',
            'location' => 'nullable|string|max:255',
            'company_url' => 'nullable|url|max:500',
            'technologies' => 'nullable|array',
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

        $experience = Experience::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Experience created successfully',
            'data' => $experience,
        ], 201);

    }

    /**
     * Display the specified resource.
     */
    public function show(Experience $experience)
    {
        return response()->json([
            'success' => true,
            'data' => $experience,
        ]);

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Experience $experience)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Experience $experience)
    {
        $this->authorize('update', $experience);

        $validator = Validator::make($request->all(), [
            'company' => 'string|max:255',
            'position' => 'string|max:255',
            'description' => 'string',
            'start_date' => 'date',
            'end_date' => 'nullable|date|after:start_date',
            'is_current' => 'boolean',
            'location' => 'nullable|string|max:255',
            'company_url' => 'nullable|url|max:500',
            'technologies' => 'nullable|array',
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

        $experience->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Experience updated successfully',
            'data' => $experience,
        ]);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Experience $experience)
    {
        $this->authorize('delete', $experience);

        $experience->delete();

        return response()->json([
            'success' => true,
            'message' => 'Experience deleted successfully',
        ]);

    }
}
