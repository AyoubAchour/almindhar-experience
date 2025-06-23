// Script to update the Tabarka experience to have has_game = true
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateTabarkaTreasuresFlag() {
  try {
    console.log('Checking Tabarka experience...');
    
    // First, check if the Tabarka experience exists
    const { data: experience, error: fetchError } = await supabase
      .from('experiences')
      .select('id, title, has_game')
      .eq('title', 'Plongée à Tabarka')
      .single();

    if (fetchError) {
      console.error('Error fetching Tabarka experience:', fetchError);
      return;
    }

    if (!experience) {
      console.log('Tabarka experience not found in database');
      return;
    }

    console.log('Found Tabarka experience:', {
      id: experience.id,
      title: experience.title,
      has_game: experience.has_game
    });

    if (experience.has_game) {
      console.log('Tabarka experience already has has_game = true');
      return;
    }

    // Update the has_game flag to true
    const { data: updateData, error: updateError } = await supabase
      .from('experiences')
      .update({ has_game: true })
      .eq('id', experience.id)
      .select();

    if (updateError) {
      console.error('Error updating Tabarka experience:', updateError);
      return;
    }

    console.log('Successfully updated Tabarka experience has_game flag to true');
    console.log('Updated data:', updateData);

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the update
updateTabarkaTreasuresFlag();
