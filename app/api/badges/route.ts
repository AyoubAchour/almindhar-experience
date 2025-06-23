import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  }

  // Récupère tous les badges de l'utilisateur
  const { data, error } = await supabase
    .from('user_badges')
    .select('id, badges(label)')
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const badges = data.map((row) => row.badges[0]?.label).filter((lbl): lbl is string => Boolean(lbl));
  return NextResponse.json({ badges });
} 