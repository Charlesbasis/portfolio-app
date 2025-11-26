import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const pathname = request.nextUrl.pathname;

  if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding'))) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (token && pathname.startsWith('/dashboard')) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/onboarding/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.completed) {
          return NextResponse.redirect(new URL('/onboarding', request.url));
        }
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  }

  // If accessing onboarding and already completed, redirect to dashboard
  if (token && pathname === '/onboarding') {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/onboarding/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.data?.completed) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding']
};
