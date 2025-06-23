"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Loader2, ChevronDown } from "lucide-react";
import { useProfile } from "@/contexts/ProfileContext";

const PREFERENCES = [
  {
    id: "desert",
    name: "Aventure dans le désert",
    icon: "🏜️",
    description: "Explorez les dunes et vivez des expériences uniques"
  },
  {
    id: "culture",
    name: "Visites culturelles",
    icon: "🏛️",
    description: "Découvrez l'histoire et le patrimoine tunisien"
  },
  {
    id: "family",
    name: "Activités familiales",
    icon: "👨‍👩‍👧‍👦",
    description: "Des aventures pour tous les âges"
  },
  {
    id: "food",
    name: "Gastronomie",
    icon: "🍽️",
    description: "Savourez les délices culinaires locaux"
  },
  {
    id: "nature",
    name: "Nature & Randonnée",
    icon: "🌄",
    description: "Explorez les paysages naturels magnifiques"
  },
  {
    id: "sports",
    name: "Sports & Loisirs",
    icon: "🏄‍♂️",
    description: "Activités sportives et récréatives"
  },
  {
    id: "wellness",
    name: "Bien-être & Spa",
    icon: "💆‍♀️",
    description: "Relaxation et soins du corps"
  },
  {
    id: "shopping",
    name: "Artisanat & Shopping",
    icon: "🛍️",
    description: "Découvrez l'artisanat local et les souvenirs uniques"
  },
];

export default function CompleteProfilePage() {
  const router = useRouter();
  const { updateProfile, refreshProfile } = useProfile();
  const [fullName, setFullName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showAllPreferences, setShowAllPreferences] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle avatar file selection and preview
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFile(file);
  };

  const handleFile = (file: File | null) => {
    setAvatarFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  // Handle drag and drop events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleFile(file);
      } else {
        setError("Veuillez choisir un fichier image");
      }
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle preference selection
  const togglePreference = (prefId: string) => {
    setPreferences((prev) =>
      prev.includes(prefId)
        ? prev.filter((p) => p !== prefId)
        : [...prev, prefId]
    );
  };

  // Get visible preferences
  const visiblePreferences = showAllPreferences ? PREFERENCES : PREFERENCES.slice(0, 4);

  // Upload avatar to Supabase Storage
  async function uploadAvatar(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${fileName}`;
    // Use Supabase client from the browser
    const { createClient } = await import("@/utils/supabase/client");
    const supabase = createClient();
    const { error } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: false });
    if (error) throw new Error("Erreur lors de l'upload de la photo de profil.");
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    return data.publicUrl;
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!fullName.trim()) {
      setError("Le nom complet est requis.");
      return;
    }
    if (!avatarFile) {
      setError("La photo de profil est requise.");
      return;
    }
    if (preferences.length === 0) {
      setError("Veuillez sélectionner au moins une préférence.");
      return;
    }
    setIsLoading(true);
    try {
      // Upload avatar and get public URL
      const avatarUrl = await uploadAvatar(avatarFile);
      // Send PATCH request to API
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          avatar_url: avatarUrl,
          preferences: preferences.map(id => {
            const pref = PREFERENCES.find(p => p.id === id);
            return pref ? pref.name : id;
          }),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la mise à jour du profil.");
      // Award the "Nouvel Aventurier" badge (ignore errors)
      try {
        await fetch('/api/badges/award', { method: 'POST' });
      } catch {
        // ignore failures
      }
      // Update profile context and refresh data
      updateProfile({
        full_name: fullName,
        avatar_url: avatarUrl,
        preferences: preferences.map(id => {
          const pref = PREFERENCES.find(p => p.id === id);
          return pref ? pref.name : id;
        })
      });
      await refreshProfile();
      
      setSuccess(true);
      setTimeout(() => router.push('/protected?from=complete-profile'), 500);
    } catch (err: any) {
      setError(err.message || "Erreur inattendue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center relative overflow-hidden">
      {/* Animated Blobs */}
      <div className="absolute top-0 left-0 w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-indigo-300 to-purple-300 opacity-30 blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-[35vw] h-[35vw] rounded-full bg-gradient-to-r from-purple-300 to-pink-300 opacity-30 blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 -left-[10vw] w-[25vw] h-[25vw] rounded-full bg-gradient-to-r from-blue-300 to-indigo-300 opacity-20 blur-3xl animate-blob animation-delay-4000"></div>
      <div className="w-full px-4 py-12 md:py-12 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Motivational Copy */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 md:p-12 flex flex-col justify-center relative">
              <div className="absolute top-[10%] left-[10%] w-32 h-32 bg-white/10 rounded-full mix-blend-overlay filter blur-xl opacity-50 animate-pulse"></div>
              <div className="absolute bottom-[10%] right-[10%] w-40 h-40 bg-white/10 rounded-full mix-blend-overlay filter blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
              <div className="relative z-10 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Complétez votre profil</h2>
                <div className="h-1 w-20 bg-white/50 rounded-full mb-6"></div>
                <p className="text-white/90 text-lg mb-8">Personnalisez votre expérience et débloquez des recommandations sur mesure en complétant votre profil.</p>
                <ul className="space-y-4 text-white/90 text-base">
                  <li className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-white">✓</span>
                    <span>Ajoutez une photo de profil</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-white">✓</span>
                    <span>Indiquez votre nom complet</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-white">✓</span>
                    <span>Sélectionnez vos préférences d'aventure</span>
                  </li>
                </ul>
                <div className="mt-12 text-sm text-white/80 flex items-center gap-2">
                  <div className="w-16 h-1 bg-white/40 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-white rounded-full"></div>
                  </div>
                  <span>Étape 2 sur 2</span>
                </div>
              </div>
            </div>
            {/* Right Side - Form */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center">
              <form className="w-full max-w-md space-y-8" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div>
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-1.5 block">Nom complet</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Votre nom complet"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* Avatar Upload */}
                <div>
                  <Label htmlFor="avatar" className="text-sm font-medium text-gray-700 mb-1.5 block">Photo de profil</Label>
                  <div 
                    className={`mt-1 flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-dashed rounded-md appearance-none cursor-pointer hover:border-indigo-500 focus:outline-none ${
                      isDragging 
                        ? "border-indigo-500 bg-indigo-50" 
                        : avatarPreview 
                          ? "border-green-500" 
                          : "border-gray-300"
                    }`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleUploadClick}
                  >
                    <input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    {avatarPreview ? (
                      <div className="flex flex-col items-center">
                        <div className="relative w-20 h-20 mb-2 overflow-hidden rounded-full border-2 border-indigo-500 shadow-md transition-all hover:scale-105">
                          <Image
                            src={avatarPreview}
                            alt="Aperçu de la photo de profil"
                            fill
                            style={{ objectFit: 'cover' }}
                            className="transition duration-300"
                          />
                        </div>
                        <p className="text-xs text-indigo-600 font-medium">Cliquez ou glissez pour changer</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="flex items-center justify-center w-10 h-10 mb-2 rounded-full bg-indigo-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </span>
                        <span className="text-sm text-gray-600 font-medium">Cliquez ou glissez une image ici</span>
                        <span className="text-xs text-gray-500">PNG, JPG ou JPEG</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Vos préférences</Label>
                  <div className="mt-3 space-y-2">
                    {visiblePreferences.map((pref) => (
                      <div 
                        key={pref.id}
                        onClick={() => togglePreference(pref.id)}
                        className={`
                          flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200
                          ${preferences.includes(pref.id) 
                            ? 'border-indigo-500 bg-indigo-50/50' 
                            : 'border-gray-200 bg-white hover:border-indigo-300'}
                        `}
                      >
                        <div className="flex items-center w-full">
                          <div className="flex-shrink-0 text-xl mr-3">
                            {pref.icon}
                          </div>
                          <div className="flex-1 min-w-0 pr-2">
                            <p className="text-sm font-medium text-gray-800">
                              {pref.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {pref.description}
                            </p>
                          </div>
                          <div className="w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0">
                            {preferences.includes(pref.id) && (
                              <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {!showAllPreferences && PREFERENCES.length > 4 && (
                      <button
                        type="button"
                        onClick={() => setShowAllPreferences(true)}
                        className="w-full flex items-center justify-center gap-2 p-3 mt-2 text-indigo-600 hover:text-indigo-800 transition-all duration-200 border border-dashed border-indigo-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50/50"
                      >
                        <span>Voir plus d'options</span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all transform hover:translate-y-[-2px] hover:shadow-md font-medium flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <span className="mr-1">Finaliser mon profil</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </Button>

                {/* Error and Success Messages */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  </div>
                )}
                
                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Profil complété avec succès ! Redirection...</span>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 