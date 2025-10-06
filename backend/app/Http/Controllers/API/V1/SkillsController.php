<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\Skills;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SkillsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
                $query = Skills::query()->orderBy('order')->orderBy('name');

        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Group by category if requested
        if ($request->has('grouped') && $request->grouped === 'true') {
            $skills = $query->get()->groupBy('category');
            
            return response()->json([
                'success' => true,
                'data' => $skills,
            ]);
        }

        $skills = $query->get();

        return response()->json([
            'success' => true,
            'data' => $skills,
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
            'name' => 'required|string|max:255',
            'category' => 'required|in:frontend,backend,database,tools,devops,other',
            'proficiency' => 'required|integer|min:0|max:100',
            'years_of_experience' => 'nullable|integer|min:0|max:50',
            'icon_url' => 'nullable|url|max:500',
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

        $skill = Skills::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Skill created successfully',
            'data' => $skill,
        ], 201);

    }

    /**
     * Display the specified resource.
     */
    public function show(Skills $skills)
    {
        return response()->json([
            'success' => true,
            'data' => $skills,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Skills $skills)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Skills $skills)
    {
        $this->authorize('update', $skills);

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'category' => 'in:frontend,backend,database,tools,devops,other',
            'proficiency' => 'integer|min:0|max:100',
            'years_of_experience' => 'nullable|integer|min:0|max:50',
            'icon_url' => 'nullable|url|max:500',
            'order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $skills->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Skill updated successfully',
            'data' => $skills,
        ]);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Skills $skills)
    {
        $this->authorize('delete', $skills);

        $skills->delete();

        return response()->json([
            'success' => true,
            'message' => 'Skill deleted successfully',
        ]);
    }
}
