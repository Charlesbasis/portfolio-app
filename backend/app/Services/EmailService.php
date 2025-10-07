<?php

namespace App\Services;

use App\Models\Contact;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailService
{
    /**
     * Send contact form notification email.
     */
    public function sendContactNotification(Contact $contact)
    {
        try {
            Mail::send('emails.contact-notification', ['contact' => $contact], function ($message) use ($contact) {
                $message->to(config('mail.from.address'))
                    ->subject('New Contact Form Submission: ' . $contact->subject)
                    ->replyTo($contact->email, $contact->name);
            });

            Log::info('Contact notification email sent', ['contact_id' => $contact->id]);
        } catch (\Exception $e) {
            Log::error('Failed to send contact notification email', [
                'contact_id' => $contact->id,
                'error' => $e->getMessage(),
            ]);
            
            throw $e;
        }
    }

    /**
     * Send welcome email to new user.
     */
    public function sendWelcomeEmail($user)
    {
        try {
            Mail::send('emails.welcome', ['user' => $user], function ($message) use ($user) {
                $message->to($user->email, $user->name)
                    ->subject('Welcome to ' . config('app.name'));
            });

            Log::info('Welcome email sent', ['user_id' => $user->id]);
        } catch (\Exception $e) {
            Log::error('Failed to send welcome email', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send auto-reply to contact form submission.
     */
    public function sendContactAutoReply(Contact $contact)
    {
        try {
            Mail::send('emails.contact-auto-reply', ['contact' => $contact], function ($message) use ($contact) {
                $message->to($contact->email, $contact->name)
                    ->subject('Thank you for contacting us');
            });

            Log::info('Contact auto-reply sent', ['contact_id' => $contact->id]);
        } catch (\Exception $e) {
            Log::error('Failed to send contact auto-reply', [
                'contact_id' => $contact->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
