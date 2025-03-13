import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    console.log(`Middleware executing for path: ${pathname}`);

    // List of paths that require authentication
    const authRequiredPaths = [
        '/profile',
        '/bookings',
        '/games',
    ];

    // List of auth paths that should be inaccessible to authenticated users
    const authPaths = [
        '/auth/login',
        '/auth/signup',
        '/auth/reset-password',
        '/auth/confirmation',
    ];

    // Check if the current path requires authentication
    const requiresAuth = authRequiredPaths.some(path =>
        pathname === path || pathname.startsWith(`${path}/`)
    );

    // Check if the current path is an auth page
    const isAuthPath = authPaths.some(path =>
        pathname === path || pathname.startsWith(`${path}/`)
    );
    
    console.log(`Is auth path: ${isAuthPath}`);
    console.log(`Requires auth: ${requiresAuth}`);

    // If the path doesn't require auth and is not an auth page, allow access
    if (!requiresAuth && !isAuthPath) {
        return NextResponse.next();
    }

    // Create a Supabase client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name) {
                    return request.cookies.get(name)?.value;
                },
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                set(_name, _value, _options) {
                    // This is used for setting cookies during SSR,
                    // which we don't need in middleware
                    return;
                },
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                remove(_name, _options) {
                    // This is used for removing cookies during SSR,
                    // which we don't need in middleware
                    return;
                },
            },
        }
    );

    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    console.log(`Session exists: ${!!session}`);
    console.log(`Session user: ${session?.user?.email}`);

    // If no session and the path requires auth, redirect to login
    if (!session && requiresAuth) {
        const redirectUrl = new URL('/auth/login', request.url);
        redirectUrl.searchParams.set('returnUrl', pathname);
        console.log(`Redirecting unauthenticated user to: ${redirectUrl.toString()}`);
        return NextResponse.redirect(redirectUrl);
    }

    // If user is authenticated and trying to access an auth page, redirect to home/profile
    if (session && isAuthPath) {
        // Check if there's a returnUrl query parameter to redirect back to
        const returnUrl = request.nextUrl.searchParams.get('returnUrl');
        
        // If returnUrl exists and is not an auth page itself, redirect there
        if (returnUrl && !authPaths.some(path => returnUrl.startsWith(path))) {
            const redirectUrl = new URL(returnUrl, request.url);
            console.log(`Redirecting authenticated user to returnUrl: ${redirectUrl.toString()}`);
            return NextResponse.redirect(redirectUrl);
        }
        
        // Otherwise redirect to profile or homepage
        const redirectUrl = new URL('/profile', request.url);
        console.log(`Redirecting authenticated user to profile: ${redirectUrl.toString()}`);
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

// Configure which routes to run the middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Explicitly include auth routes to ensure middleware runs for them
    '/auth/:path*'
  ],
};