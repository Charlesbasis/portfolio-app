<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Projects;
use App\Repositories\ProjectRepository;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProjectsController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private ProjectRepository $repository
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Log::info('ProjectsController@index called', [
        //     'params' => $request->all(),
        //     'ip' => $request->ip()
        // ]);

        $cacheKey = 'projects:list:' . request('featured', 'all') . ':' . request('page', 1);
        
        $projects = Cache::remember($cacheKey, 3600, function () use ($request) {
            $filters = $request->only(['featured', 'technology']);
            $query = $this->repository->getAll($filters);

            return $query->paginate($request->get('per_page', 12));
        });

        // Log::info('ProjectsController: Retrieved projects', [
        //     'count' => $projects->count(),
        //     'total' => $projects->total()
        // ]);

        return response()->json([
            'success' => true,
            'data' => ProjectResource::collection($projects->items()),
            'meta' => [
                'current_page' => $projects->currentPage(),
                'last_page' => $projects->lastPage(),
                'per_page' => $projects->perPage(),
                'total' => $projects->total(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Log::info('ProjectsController@store called', [
        //     'user_id' => $request->user()->id
        // ]);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'long_description' => 'nullable|string',
            'technologies' => 'nullable|array',
            'github_url' => 'nullable|url',
            'live_url' => 'nullable|url',
            'featured' => 'boolean',
            'order' => 'nullable|integer',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            Log::warning('ProjectsController@store validation failed', [
                'errors' => $validator->errors()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        $data['user_id'] = $request->user()->id;
        $data['status'] = 'draft'; 

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('projects', 'public');
            $data['image_url'] = $path; 
            
            // Log::info('ProjectsController@store image uploaded', [
            //     'path' => $path
            // ]);
        }

        $project = Projects::create($data);

        Cache::tags('projects')->flush();

        // Log::info('ProjectsController@store success', [
        //     'project_id' => $project->id,
        //     'slug' => $project->slug
        // ]);

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully',
            'data' => new ProjectResource($project),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        // Log::info('ProjectsController@show called', [
        //     'slug' => $slug
        // ]);

        $cacheKey = 'projects:list:' . request('featured', 'all') . ':' . request('page', 1);
        
        $project = Cache::remember($cacheKey, 3600, function () use ($slug) {
            return $this->repository->findBySlugOrFail($slug);
        });

        // Log::info('ProjectsController@show success', [
        //     'project_id' => $project->id,
        //     'title' => $project->title
        // ]);

        return response()->json([
            'success' => true,
            'data' => new ProjectResource($project),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Projects $project)
    {
        // Log::info('ProjectsController@update called', [
        //     'project_id' => $project->id,
        //     'user_id' => $request->user()->id
        // ]);

        $this->authorize('update', $project);

        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'description' => 'string',
            'long_description' => 'nullable|string',
            'technologies' => 'nullable|array',
            'github_url' => 'nullable|url',
            'live_url' => 'nullable|url',
            'featured' => 'boolean',
            'status' => 'in:draft,published',
            'order' => 'nullable|integer',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            Log::warning('ProjectsController@update validation failed', [
                'errors' => $validator->errors()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('image')) {
            if ($project->image_url) {
                Storage::disk('public')->delete($project->image_url);
                // Log::info('ProjectsController@update old image deleted', [
                //     'path' => $project->image_url
                // ]);
            }
            
            $path = $request->file('image')->store('projects', 'public');
            $data['image_url'] = $path; 
            
            // Log::info('ProjectsController@update new image uploaded', [
            //     'path' => $path
            // ]);
        }

        $project->update($data);

        Cache::tags('projects')->flush();
        Cache::forget("project:{$project->slug}");

        // Log::info('ProjectsController@update success', [
        //     'project_id' => $project->id,
        //     'slug' => $project->slug
        // ]);

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully',
            'data' => new ProjectResource($project),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Projects $project)
    {
        // Log::info('ProjectsController@destroy called', [
        //     'project_id' => $project->id,
        //     'user_id' => auth()->id()
        // ]);

        $this->authorize('delete', $project);

        if ($project->image_url) {
            Storage::disk('public')->delete($project->image_url);
            
            // Log::info('ProjectsController@destroy image deleted', [
            //     'path' => $project->image_url
            // ]);
        }

        $slug = $project->slug;
        $project->delete();

        Cache::tags('projects')->flush();
        Cache::forget("project:{$slug}");

        // Log::info('ProjectsController@destroy success', [
        //     'project_id' => $project->id
        // ]);

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully',
        ]);
    }
}
