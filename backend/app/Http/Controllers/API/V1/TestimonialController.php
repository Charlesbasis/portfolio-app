<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use App\Repositories\TestimonialRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class TestimonialController extends Controller
{
    public function __construct(
        private TestimonialRepository $repository
    ) {}
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Log::info('TestimonialController@index called', [
        //     'params' => $request->all(),
        //     'ip' => $request->ip()
        // ]);

        $cacheKey = 'testimonials:' . md5(json_encode($request->all()));

        $testimonials = Cache::remember($cacheKey, 3600, function () use ($request) {
            $query = $this->repository->getAll();

            return $query->paginate($request->get('per_page', 12));
        });

        // Log::info('TestimonialController: Retrieved testimonials', [
        //     'count' => $testimonials->count(),
        //     'total' => $testimonials->total()
        // ]);

        return TestimonialResource::collection($testimonials);
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
            'role' => 'required|string|max:255',
            'content' => 'required|string|max:255',
            'avatar_url' => 'nullable|url|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        $data['user_id'] = $request->user()->id;

        $testimonial = Testimonial::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Testimonial created successfully',
            'data' => new TestimonialResource($testimonial),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Testimonial $testimonial)
    {
        return response()->json([
            'success' => true,
            'data' => new TestimonialResource($testimonial),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Testimonial $testimonial)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Testimonial $testimonial)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'role' => 'string|max:255',
            'content' => 'string|max:255',
            'avatar_url' => 'nullable|url|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $testimonial->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Testimonial updated successfully',
            'data' => new TestimonialResource($testimonial),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();

        return response()->json([
            'success' => true,
            'message' => 'Testimonial deleted successfully',
        ]);
    }
}
