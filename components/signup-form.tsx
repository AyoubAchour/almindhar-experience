"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Email and password are required");
      setIsLoading(false);
      return;
    }

    try {
      // Call our API route for signup
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      // Show success message
      setSuccess(true);
      
      // Redirect to protected page after a short delay
      setTimeout(() => {
        router.push("/protected");
        router.refresh(); // Force a refresh to update the auth state
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {success ? (
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
          <svg 
            className="w-16 h-16 text-green-500 mx-auto mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-bold text-green-800 mb-2">Compte créé avec succès!</h3>
          <p className="text-green-700 mb-4">Vous allez être redirigé vers votre espace personnel...</p>
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 text-green-600 animate-spin" />
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Créer un Compte</h1>
            <div className="h-1 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mt-2 mb-4"></div>
            <p className="text-gray-600">
              Rejoignez la communauté Almindhar Experience pour découvrir des aventures uniques
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Adresse e-mail</Label>
              <Input 
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com" 
                required 
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                minLength={6}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-500">
                Le mot de passe doit contenir au moins 6 caractères
              </p>
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-md animated-border-button transition-all duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  <span className="animated-text font-medium">Création en cours...</span>
                </>
              ) : (
                <span className="animated-text font-medium">S'inscrire</span>
              )}
            </button>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Vous avez déjà un compte?{" "}
                <Link className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors" href="/sign-in">
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
