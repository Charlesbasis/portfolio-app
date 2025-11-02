<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SkillResource;
use App\Models\Skill;
use App\Repositories\SkillRepository;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class SkillsController extends Controller
{
    use AuthorizesRequests;
    
    public function __construct(
        private SkillRepository $repository
    ) {}
    
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Log::info('SkillsController@index called', [
        //     'params' => $request->all(),
        //     'ip' => $request->ip()
        // ]);

        $cacheKey = 'skills:list:' . request('grouped', 'true');

        $skills = Cache::remember($cacheKey, 3600, function () use ($request) {

            if ($request->has('grouped') && $request->grouped === 'true') {
                return $this->repository->getGroupedByCategory();
            }

            $filters = $request->only(['category', 'user_id']);
            $query = $this->repository->getAll($filters);

            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            return $query->get();
        });

        // Log::info('SkillsController: Retrieved skills', [
        //     'count' => is_countable($skills) ? count($skills) : $skills->count()
        // ]);

        if ($request->has('grouped') && $request->grouped === 'true') {
            return response()->json([
                'success' => true,
                'data' => $skills,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => SkillResource::collection($skills),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Log::info('SkillsController@store called', [
        //     'user_id' => $request->user()->id
        // ]);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|in:frontend,backend,database,tools,devops,other',
            'proficiency' => 'required|integer|min:0|max:100',
            'years_of_experience' => 'nullable|integer|min:0|max:50',
            'icon_url' => 'nullable|url|max:500',
            'order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            Log::warning('SkillsController@store validation failed', [
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

        $skill = Skill::create($data);

        Cache::forget('skills:*');

        // Log::info('SkillsController@store success', [
        //     'skill_id' => $skill->id
        // ]);

        return response()->json([
            'success' => true,
            'message' => 'Skill created successfully',
            'data' => new SkillResource($skill),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Skill $skill)
    {
        // Log::info('SkillsController@show called', [
        //     'skill_id' => $skill->id
        // ]);

        return response()->json([
            'success' => true,
            'data' => new SkillResource($skill),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Skill $skill)
    {
        // Log::info('SkillsController@update called', [
        //     'skill_id' => $skill->id,
        //     'user_id' => $request->user()->id
        // ]);

        $this->authorize('update', $skill);

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'category' => 'in:frontend,backend,database,tools,devops,other',
            'proficiency' => 'integer|min:0|max:100',
            'years_of_experience' => 'nullable|integer|min:0|max:50',
            'icon_url' => 'nullable|url|max:500',
            'order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            Log::warning('SkillsController@update validation failed', [
                'errors' => $validator->errors()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $skill->update($validator->validated());

        Cache::forget('skills:*');

        // Log::info('SkillsController@update success', [
        //     'skill_id' => $skill->id
        // ]);

        return response()->json([
            'success' => true,
            'message' => 'Skill updated successfully',
            'data' => new SkillResource($skill),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Skill $skill)
    {
        // Log::info('SkillsController@destroy called', [
        //     'skill_id' => $skill->id,
        //     'user_id' => auth()->id()
        // ]);

        $this->authorize('delete', $skill);

        $skill->delete();

        Cache::forget('skills:*');

        // Log::info('SkillsController@destroy success', [
        //     'skill_id' => $skill->id
        // ]);

        return response()->json([
            'success' => true,
            'message' => 'Skill deleted successfully',
        ]);
    }
}
