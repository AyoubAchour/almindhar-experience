'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Pencil, Check, X, Loader2, Camera, Upload } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { useProfile } from '@/contexts/ProfileContext';

const PREFERENCES = [
  { id: 'desert', name: 'Aventure dans le désert', icon: '🏜️' },
  { id: 'culture', name: 'Visites culturelles', icon: '🏛️' },
  { id: 'family', name: 'Activités familiales', icon: '👨‍👩‍👧‍👦' },
  { id: 'food', name: 'Gastronomie', icon: '🍽️' },
  { id: 'nature', name: 'Nature & Randonnée', icon: '🌄' },
  { id: 'sports', name: 'Sports & Loisirs', icon: '🏄‍♂️' },
  { id: 'wellness', name: 'Bien-être & Spa', icon: '💆‍♀️' },
  { id: 'shopping', name: 'Artisanat & Shopping', icon: '🛍️' },
];

type Profile = {
  full_name: string;
  avatar_url: string | null;
  preferences: string[];
};

type EditableProfileProps = {
  initialProfile: Profile;
  userEmail: string;
  userId: string;
  userBadges: Array<{
    id: string;
    badges: { label: string } | { label: string }[];
  }>;
};

export default function EditableProfile({ initialProfile, userEmail, userId, userBadges }: EditableProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();
  const { updateProfile, refreshProfile } = useProfile();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${uuidv4()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const updatedProfile = { ...profile, avatar_url: publicUrl };
      setProfile(updatedProfile);
      updateProfile(updatedProfile);
      setUploadProgress(100);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Une erreur est survenue lors du téléchargement de l\'image');
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      handleImageUpload(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    multiple: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    setError('');

    try {
      // First update the profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          full_name: profile.full_name,
          preferences: profile.preferences,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString(), // Force an update event
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Wait a moment for the update to propagate
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verify the update was successful
      const { data: updatedProfile } = await supabase
        .from('user_profiles')
        .select('full_name, avatar_url, preferences')
        .eq('id', userId)
        .single();

      if (!updatedProfile || updatedProfile.avatar_url !== profile.avatar_url) {
        throw new Error('Profile update verification failed');
      }

      // Update the profile context and refresh
      updateProfile(profile);
      await refreshProfile();

      setIsEditing(false);
      setIsSaving(false);

      // If this was called from complete-profile, redirect to dashboard
      const isFromCompleteProfile = window.location.pathname.includes('complete-profile');
      if (isFromCompleteProfile) {
        window.location.href = '/protected?from=profile-update';
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la sauvegarde');
      console.error('Error updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const togglePreference = (prefId: string) => {
    const prefObj = PREFERENCES.find(p => p.id === prefId);
    if (!prefObj) return;

    setProfile(prev => ({
      ...prev,
      preferences: prev.preferences.includes(prefObj.name)
        ? prev.preferences.filter(p => p !== prefObj.name)
        : [...prev.preferences, prefObj.name]
    }));
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border flex flex-col items-center px-8 py-10 relative transition-all hover:shadow-2xl">
      {/* Avatar with ring and shadow */}
      <motion.div
        className="relative w-36 h-36 mb-4 group"
        whileHover={{ scale: isEditing ? 1.05 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-400 p-1 shadow-lg">
          <div
            {...(isEditing ? getRootProps() : {})}
            className={`relative w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden
              ${isEditing ? 'cursor-pointer hover:opacity-90' : ''}
              ${isDragActive ? 'ring-4 ring-indigo-400 ring-offset-2' : ''}`}
          >
            {isEditing && <input {...getInputProps()} />}
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Avatar"
                width={136}
                height={136}
                className="object-cover w-full h-full"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
            )}
            {/* Upload overlay */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity group-hover:opacity-100"
              >
                <Upload className="w-8 h-8 text-white" />
              </motion.div>
            )}
            {/* Upload progress */}
            {isUploading && (
              <motion.div
                className="absolute inset-0 bg-black/60 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-white text-sm font-medium">
                  {Math.round(uploadProgress)}%
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Subtitle */}
      <span className="text-sm text-indigo-600 font-semibold mb-1 tracking-wide uppercase">
        Profil utilisateur
      </span>

      {/* Name and Email */}
      <motion.div
        className="relative w-full text-center mb-1"
        initial={false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {isEditing ? (
          <motion.input
            type="text"
            value={profile.full_name}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            className="text-3xl font-bold text-gray-900 text-center w-full bg-transparent border-b-2 border-indigo-500 focus:outline-none focus:border-indigo-700 transition-all"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        ) : (
          <motion.h1
            className="text-3xl font-bold text-gray-900"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {profile.full_name}
          </motion.h1>
        )}
      </motion.div>
      <p className="text-base text-gray-500 mb-6">{userEmail}</p>

      {/* Preferences */}
      <motion.div 
        className="w-full mb-6"
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.h2 
          className="font-semibold mb-2 text-gray-800"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Centres d'intérêt
        </motion.h2>
        <motion.div 
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {PREFERENCES.map((pref) => (
            <motion.button
              key={pref.id}
              onClick={() => isEditing && togglePreference(pref.id)}
              whileHover={isEditing ? { scale: 1.05 } : {}}
              whileTap={isEditing ? { scale: 0.95 } : {}}
              className={`inline-flex items-center gap-1 ${
                profile.preferences.includes(pref.name)
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              } text-xs font-semibold px-3 py-1 rounded-full border shadow-sm transition-colors
                ${isEditing ? 'cursor-pointer hover:bg-indigo-200' : ''}`}
              disabled={!isEditing}
            >
              <span className="text-lg">{pref.icon}</span>
              <span>{pref.name}</span>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Badges Section */}
      <motion.div 
        className="w-full mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
      >
        <motion.h2 
          className="font-semibold mb-2 text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Mes Badges
        </motion.h2>
        {userBadges && userBadges.length > 0 ? (
          <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {userBadges.map((ub) => {
              const label = Array.isArray(ub.badges) ? ub.badges[0]?.label : ub.badges?.label;
              if (typeof label === 'string' && label.trim().toLowerCase() === 'nouvel aventurier'.toLowerCase()) {
                return (
                  <motion.span
                    key={ub.id}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-bold px-4 py-1 rounded-full shadow-md border-2 border-yellow-500"
                    whileHover={{ scale: 1.05, rotate: [0, -2, 2, -2, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-lg">🏅</span>
                    {label}
                  </motion.span>
                );
              }
              return (
                <motion.span
                  key={ub.id}
                  className="inline-flex items-center bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {label ?? <span className="text-red-500">(no label)</span>}
                </motion.span>
              );
            })}
          </motion.div>
        ) : (
          <motion.p 
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Aucun badge pour le moment
          </motion.p>
        )}
      </motion.div>

      {/* Edit/Save Buttons */}
      <motion.div
        className="flex gap-2"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.button
              key="edit"
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md font-semibold shadow-md transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Pencil className="w-4 h-4" />
              Modifier mon profil
            </motion.button>
          ) : (
            <motion.div 
              className="flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                key="save"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-md font-semibold shadow-md transition-all disabled:opacity-50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Sauvegarder
              </motion.button>
              <motion.button
                key="cancel"
                onClick={() => {
                  setIsEditing(false);
                  setProfile(initialProfile);
                  setError('');
                }}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-semibold shadow-md transition-all disabled:opacity-50"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <X className="w-4 h-4" />
                Annuler
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-md border border-red-200"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
   
