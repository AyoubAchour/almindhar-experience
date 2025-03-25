import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Ensure params is properly awaited
  const id = params?.id;
  
  if (!id) {
    return NextResponse.json({ error: "ID d'expérience manquant" }, { status: 400 });
  }
  
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching experience with ID ${id}:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }
    
    // Parse JSON strings into objects if needed
    const experience = {
      ...data,
      features: typeof data.features === 'string'
        ? JSON.parse(data.features)
        : data.features,
      available_dates: typeof data.available_dates === 'string'
        ? JSON.parse(data.available_dates)
        : data.available_dates
    };
    
    return NextResponse.json(experience);
  } catch (error: any) {
    console.error('Unexpected error fetching experience:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}
