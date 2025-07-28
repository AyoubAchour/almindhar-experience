import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  if (redirectTo) {
    // Validate redirect URL to prevent open redirect attacks
    try {
      const redirectUrl = new URL(redirectTo, origin);
      // Only allow redirects to the same origin
      if (redirectUrl.origin === origin) {
        return NextResponse.redirect(redirectUrl.toString());
      }
    } catch {
      // Invalid URL, fall through to default redirect
    }
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/protected`);
}
