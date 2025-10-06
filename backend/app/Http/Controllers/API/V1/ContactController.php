<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Contact::query()->orderBy('created_at', 'desc');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $contacts = $query->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $contacts,
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Contact $contact)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contact $contact)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:unread,read,replied,archived',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $contact->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Contact status updated successfully',
            'data' => $contact,
        ]);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        $contact->delete();

        return response()->json([
            'success' => true,
            'message' => 'Contact deleted successfully',
        ]);

    }

    /**
     * Submit a contact form.
     * Public endpoint with rate limiting
     */
    public function submit(Request $request)
    {
        // Rate limiting: 3 submissions per hour per IP
        $key = 'contact-form:' . $request->ip();
        
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            
            return response()->json([
                'success' => false,
                'message' => "Too many contact attempts. Please try again in {$seconds} seconds.",
            ], 429);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email:rfc,dns|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|min:10|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        $data['ip_address'] = $request->ip();
        $data['user_agent'] = $request->userAgent();

        try {
            // Save to database
            $contact = Contact::create($data);

            // Send email notification
            $this->emailService->sendContactNotification($contact);

            // Increment rate limiter
            RateLimiter::hit($key, 3600); // 1 hour

            return response()->json([
                'success' => true,
                'message' => 'Thank you for your message! I will get back to you soon.',
                'data' => [
                    'id' => $contact->id,
                ],
            ], 201);
        } catch (\Exception $e) {
            Log::error('Contact form submission failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to send message. Please try again later.',
            ], 500);
        }
    }

}
