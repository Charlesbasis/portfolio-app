<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CertificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Certification::where('user_id', $request->user()->id)
            ->orderBy('issue_date', 'desc')
            ->orderBy('order');

        if ($request->has('active') && $request->active === 'true') {
            $query->active();
        }

        $certifications = $query->get();

        return response()->json([
            'success' => true,
            'data' => $certifications,
        ]);
    }

    /**
     * Get user's certifications (public).
     */
    public function userCertifications($username)
    {
        $user = User::where('email', $username)
            ->orWhereHas('profile', function($query) use ($username) {
                $query->where('username', $username);
            })
            ->firstOrFail();

        $certifications = Certification::where('user_id', $user->id)
            ->orderBy('issue_date', 'desc')
            ->orderBy('order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $certifications,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'issuing_organization' => 'required|string|max:255',
            'issue_date' => 'required|date',
            'expiry_date' => 'nullable|date|after:issue_date',
            'credential_id' => 'nullable|string|max:255',
            'credential_url' => 'nullable|url|max:500',
            'description' => 'nullable|string',
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

        $certification = Certification::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Certification created successfully',
            'data' => $certification,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Certification $certification)
    {
        return response()->json([
            'success' => true,
            'data' => $certification,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Certification $certification)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'issuing_organization' => 'string|max:255',
            'issue_date' => 'date',
            'expiry_date' => 'nullable|date|after:issue_date',
            'credential_id' => 'nullable|string|max:255',
            'credential_url' => 'nullable|url|max:500',
            'description' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $certification->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Certification updated successfully',
            'data' => $certification,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Certification $certification)
    {
        $certification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Certification deleted successfully',
        ]);
    }
}
