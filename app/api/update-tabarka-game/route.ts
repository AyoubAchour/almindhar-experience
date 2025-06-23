import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();
    
    console.log('Checking Tabarka experience...');
    
    // First, check if the Tabarka experience exists
    const { data: experience, error: fetchError } = await supabase
      .from('experiences')
      .select('id, title, has_game')
      .eq('title', 'Plongée à Tabarka')
      .single();

    if (fetchError) {
      console.error('Error fetching Tabarka experience:', fetchError);
      return NextResponse.json({ error: 'Error fetching Tabarka experience', details: fetchError }, { status: 500 });
    }

    if (!experience) {
      return NextResponse.json({ error: 'Tabarka experience not found in database' }, { status: 404 });
    }

    console.log('Found Tabarka experience:', {
      id: experience.id,
      title: experience.title,
      has_game: experience.has_game
    });

    if (experience.has_game) {
      return NextResponse.json({ 
        message: 'Tabarka experience already has has_game = true',
        experience: experience
      });
    }

    // Update the has_game flag to true
    const { data: updateData, error: updateError } = await supabase
      .from('experiences')
      .update({ has_game: true })
      .eq('id', experience.id)
      .select();

    if (updateError) {
      console.error('Error updating Tabarka experience:', updateError);
      return NextResponse.json({ error: 'Error updating Tabarka experience', details: updateError }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Successfully updated Tabarka experience has_game flag to true',
      before: experience,
      after: updateData[0]
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Unexpected error', details: error }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Check the current state of the Tabarka experience
    const { data: experience, error: fetchError } = await supabase
      .from('experiences')
      .select('id, title, has_game')
      .eq('title', 'Plongée à Tabarka')
      .single();

    if (fetchError) {
      return NextResponse.json({ error: 'Error fetching Tabarka experience', details: fetchError }, { status: 500 });
    }

    if (!experience) {
      return NextResponse.json({ error: 'Tabarka experience not found in database' }, { status: 404 });
    }

    return NextResponse.json({ 
      experience: experience,
      needsUpdate: !experience.has_game
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Unexpected error', details: error }, { status: 500 });
  }
}
