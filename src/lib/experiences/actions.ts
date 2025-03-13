'use server';

import { createClient } from '@/lib/supabase/server';
import { isCurrentUserAdmin } from '@/lib/auth/adminCheck';
import { revalidatePath } from 'next/cache';

interface ExperienceData {
  title: string;
  description: string;
  short_description: string;
  location: string;
  category: string;
  price: number;
  duration: number;
  difficulty: string;
  max_participants: number;
  image_urls: string[];
  is_active: boolean;
}

export async function createExperience(data: ExperienceData) {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    throw new Error('Unauthorized: Only admins can create experiences');
  }

  const supabase = await createClient();
  
  const { error } = await supabase
    .from('experiences')
    .insert(data);
  
  if (error) {
    throw new Error(`Failed to create experience: ${error.message}`);
  }

  revalidatePath('/experiences');
  revalidatePath('/admin/experiences');
}

export async function updateExperience(id: string, data: ExperienceData) {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    throw new Error('Unauthorized: Only admins can update experiences');
  }

  const supabase = await createClient();
  
  const { error } = await supabase
    .from('experiences')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  
  if (error) {
    throw new Error(`Failed to update experience: ${error.message}`);
  }

  revalidatePath(`/experiences/${id}`);
  revalidatePath('/experiences');
  revalidatePath('/admin/experiences');
}

export async function deleteExperience(id: string) {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    throw new Error('Unauthorized: Only admins can delete experiences');
  }

  const supabase = await createClient();
  
  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(`Failed to delete experience: ${error.message}`);
  }

  revalidatePath('/experiences');
  revalidatePath('/admin/experiences');
}

export async function getExperience(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(`Failed to fetch experience: ${error.message}`);
  }
  
  return data;
}

export async function listExperiences(includeInactive = false) {
  const supabase = await createClient();
  
  let query = supabase
    .from('experiences')
    .select('*');
  
  if (!includeInactive) {
    query = query.eq('is_active', true);
  }
  
  const { data, error } = await query
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(`Failed to fetch experiences: ${error.message}`);
  }
  
  return data;
}