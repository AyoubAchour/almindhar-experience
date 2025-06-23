import { FormMessage, Message } from "@/components/form-message";
import SignupForm from "@/components/signup-form";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-50 to-white relative overflow-hidden flex items-center justify-center">
      {/* Animated Blob Decorations */}
      <div className="absolute top-0 left-0 w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-indigo-300 to-purple-300 opacity-30 blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-[35vw] h-[35vw] rounded-full bg-gradient-to-r from-purple-300 to-pink-300 opacity-30 blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 -left-[10vw] w-[25vw] h-[25vw] rounded-full bg-gradient-to-r from-blue-300 to-indigo-300 opacity-20 blur-3xl animate-blob animation-delay-4000"></div>
      
      <div className="w-full px-4 py-12 md:py-12 relative z-10">
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Content */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 md:p-12 flex flex-col justify-center relative">
              <div className="absolute top-[10%] left-[10%] w-32 h-32 bg-white/10 rounded-full mix-blend-overlay filter blur-xl opacity-50 animate-pulse"></div>
              <div className="absolute bottom-[10%] right-[10%] w-40 h-40 bg-white/10 rounded-full mix-blend-overlay filter blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
              
              <div className="relative z-10 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Découvrez les Trésors Cachés de la Tunisie</h2>
                <div className="h-1 w-20 bg-white/50 rounded-full mb-6"></div>
                <p className="text-white/90 text-lg mb-8">Rejoignez-nous pour des expériences authentiques et des aventures inoubliables.</p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-white/80">Expériences locales authentiques</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-white/80">Guides locaux passionnés</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-white/80">Aventures personnalisées</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Form */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center">
              <SignupForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
