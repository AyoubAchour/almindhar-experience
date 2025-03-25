"use client";

import { useEffect, useState, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

// Wrapper component that provides Suspense boundary
export default function VerifyPageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-lg text-center">Chargement...</p>
      </div>
    }>
      <VerifyPage />
    </Suspense>
  );
}

// The actual component with the verification logic
function VerifyPage() {
  const [message, setMessage] = useState("Finalizing your account...");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    const autoSignIn = async () => {
      if (!email) {
        setError("Email parameter is missing");
        return;
      }

      try {
        const supabase = createClient();
        
        // Check if the user exists in auth
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Error getting user:", userError);
          setError("Could not verify your account. Please try signing in manually.");
          return;
        }
        
        if (user) {
          // User is already signed in, redirect to protected area
          setMessage("Account verified! Redirecting you...");
          setTimeout(() => {
            router.push("/protected");
          }, 1500);
          return;
        }
        
        // If we get here, the user isn't signed in yet
        // We'll show a message asking them to sign in manually
        setMessage("Account created successfully!");
        setError("Please sign in with your email and password");
        setTimeout(() => {
          router.push("/sign-in");
        }, 3000);
      } catch (err) {
        console.error("Error in auto verification:", err);
        setError("An unexpected error occurred. Please try signing in manually.");
      }
    };

    autoSignIn();
  }, [email, router]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          {!error && (
            <div className="flex justify-center mb-4">
              <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error ? "Account Setup" : "Verifying Your Account"}
          </h1>
          <p className="text-gray-600 mb-4">{message}</p>
          
          {error && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
              {error}
            </div>
          )}
        </div>
        
        {error && (
          <button
            onClick={() => router.push("/sign-in")}
            className="w-full py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            Go to Sign In
          </button>
        )}
      </div>
    </div>
  );
}
