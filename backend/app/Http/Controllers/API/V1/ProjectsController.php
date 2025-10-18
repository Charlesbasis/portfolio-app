<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Projects;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProjectsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Projects::query()->published()->orderBy('order');

        if ($request->has('featured')) {
            $query->featured();
        }

        if ($request->has('technology')) {
            $query->whereJsonContains('technologies', $request->technology);
        }

        $projects = $query->paginate($request->get('per_page', 12));

        // $projects->dump();
        return response()->json([
            'success' => true,
            'data' => $projects,
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
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'long_description' => 'nullable|string',
            'technologies' => 'nullable|array',
            'github_url' => 'nullable|url',
            'live_url' => 'nullable|url',
            'featured' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        $data['user_id'] = $request->user()->id;

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('projects', 'public');
            $data['image_url'] = Storage::url($path);
        }

        $project = Projects::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully',
            'data' => $project,
        ], 201);

    }

    /**
     * Display the specified resource.
     */
    public function show(Projects $projects, $slug)
    {
        $projects = Projects::where('slug', $slug)
            ->published()
            ->firstOrFail();

        // $projects->dump();
        return response()->json([
            'success' => true,
            'data' => $projects,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Projects $projects)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Projects $projects)
    {
        // $this->authorize('update', $projects);

        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'description' => 'string',
            'long_description' => 'nullable|string',
            'technologies' => 'nullable|array',
            'github_url' => 'nullable|url',
            'live_url' => 'nullable|url',
            'featured' => 'boolean',
            'status' => 'in:draft,published',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($projects->image_url) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $projects->image_url));
            }
            
            $path = $request->file('image')->store('projects', 'public');
            $data['image_url'] = Storage::url($path);
        }

        $projects->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully',
            'data' => $projects,
        ]);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Projects $projects)
    {
        // $this->authorize('delete', $projects);

        // Delete associated image
        if ($projects->image_url) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $projects->image_url));
        }

        $projects->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully',
        ]);

    }
}
