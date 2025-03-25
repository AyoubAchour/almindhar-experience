import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-50 to-white relative overflow-hidden flex items-center justify-center">
      {/* Animated Blob Decorations */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-purple-300 to-indigo-300 opacity-30 blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-[35vw] h-[35vw] rounded-full bg-gradient-to-r from-pink-300 to-purple-300 opacity-30 blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 -right-[10vw] w-[25vw] h-[25vw] rounded-full bg-gradient-to-r from-indigo-300 to-blue-300 opacity-20 blur-3xl animate-blob animation-delay-4000"></div>
      
      <div className="w-full px-4 py-12 md:py-12 relative z-10">
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Content */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 md:p-12 flex flex-col justify-center relative">
              <div className="absolute top-[10%] left-[10%] w-32 h-32 bg-white/10 rounded-full mix-blend-overlay filter blur-xl opacity-50 animate-pulse"></div>
              <div className="absolute bottom-[10%] right-[10%] w-40 h-40 bg-white/10 rounded-full mix-blend-overlay filter blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
              
              <div className="relative z-10 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Bienvenue à Nouveau</h2>
                <div className="h-1 w-20 bg-white/50 rounded-full mb-6"></div>
                <p className="text-white/90 text-lg mb-8">Continuez votre voyage à travers la Tunisie</p>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-white/90">Gérez vos réservations</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-white/90">Accédez à vos jeux interactifs</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-white/90">Utilisez vos codes de réduction</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Form */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center">
              <div className="w-full max-w-md">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">Connexion</h1>
                  <div className="h-1 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mt-2 mb-4"></div>
                  <p className="text-gray-600">
                    Accédez à votre compte pour gérer vos réservations et découvrir de nouvelles expériences
                  </p>
                </div>
                
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Adresse e-mail</Label>
                    <Input 
                      name="email" 
                      placeholder="vous@exemple.com" 
                      required 
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</Label>
                      <Link
                        className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                        href="/forgot-password"
                      >
                        Mot de passe oublié?
                      </Link>
                    </div>
                    <Input
                      type="password"
                      name="password"
                      placeholder="Votre mot de passe"
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <SubmitButton 
                    pendingText="Connexion en cours..." 
                    formAction={signInAction}
                    className="w-full py-3 rounded-md animated-border-button hover:fill-indigo-500 transition-all duration-300"
                  >
                    <span className="animated-text font-medium">Se connecter</span>
                  </SubmitButton>
                  
                  <FormMessage message={searchParams} />
                  
                  <div className="text-center mt-6">
                    <p className="text-gray-600">
                      Vous n'avez pas de compte?{" "}
                      <Link className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors" href="/sign-up">
                        S'inscrire
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
