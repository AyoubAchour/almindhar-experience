import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface BadgeEligibility {
  name: string;
  label: string;
  description: string;
  eligible: boolean;
  reason?: string;
}

interface GameData {
  score: number;
  completed: boolean;
  experienceId: string;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
    }

    // Parse request body
    const gameData: GameData = await request.json();
    const { score, completed, experienceId } = gameData;

    // Validate that this is the Tabarka Treasures experience
    const TABARKA_EXPERIENCE_ID = 'eb7a5889-b330-4338-8bb7-a7a8bcb61a5d';
    if (experienceId !== TABARKA_EXPERIENCE_ID) {
      return NextResponse.json({ error: 'Invalid experience ID' }, { status: 400 });
    }

    // Get user's game completion count for Tabarka Treasures
    const { data: gameHistory, error: historyError } = await supabase
      .from('game_scores')
      .select('id, score, completed')
      .eq('user_id', user.id)
      .eq('experience_id', TABARKA_EXPERIENCE_ID)
      .eq('completed', true);

    if (historyError) {
      console.error('Error fetching game history:', historyError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const completedGamesCount = gameHistory?.length || 0;
    const isFirstGame = completedGamesCount === 1; // This is the first completed game (just submitted)
    const totalGamesAfterThis = completedGamesCount + (completed ? 1 : 0);

    // Define badge eligibility criteria
    const badgeEligibility: BadgeEligibility[] = [
      {
        name: 'premier_plongeur',
        label: 'Premier Plongeur',
        description: 'Complété votre premier jeu Tabarka Treasures',
        eligible: isFirstGame && completed
      },
      {
        name: 'collecteur_tresor',
        label: 'Collecteur Trésor',
        description: 'Collecté 50+ trésors en un seul jeu',
        eligible: score >= 50 && completed
      },
      {
        name: 'maitre_plongeur',
        label: 'Maître Plongeur',
        description: 'Atteint un score de 100+ points',
        eligible: score >= 100 && completed
      },
      {
        name: 'explorateur_tabarka',
        label: 'Explorateur Tabarka',
        description: 'Complété 5 jeux Tabarka Treasures',
        eligible: totalGamesAfterThis >= 5 && completed
      }
    ];

    // Get all badge definitions from database
    const eligibleBadgeNames = badgeEligibility.filter(b => b.eligible).map(b => b.name);
    
    if (eligibleBadgeNames.length === 0) {
      return NextResponse.json({ 
        success: true, 
        badges: [],
        message: 'No new badges earned this game'
      });
    }

    const { data: badgeDefinitions, error: badgeDefError } = await supabase
      .from('badges')
      .select('id, name, label, description')
      .in('name', eligibleBadgeNames);

    if (badgeDefError) {
      console.error('Error fetching badge definitions:', badgeDefError);
      return NextResponse.json({ error: 'Badge lookup error' }, { status: 500 });
    }

    // Check which badges user already has
    const { data: existingBadges, error: existingError } = await supabase
      .from('user_badges')
      .select('badge_id, badges(name)')
      .eq('user_id', user.id)
      .in('badge_id', badgeDefinitions?.map(b => b.id) || []);

    if (existingError) {
      console.error('Error checking existing badges:', existingError);
      return NextResponse.json({ error: 'Badge check error' }, { status: 500 });
    }

    const existingBadgeNames = existingBadges?.map(ub => (ub.badges as any)?.name) || [];
    const newBadges = badgeDefinitions?.filter(badge => !existingBadgeNames.includes(badge.name)) || [];

    if (newBadges.length === 0) {
      return NextResponse.json({ 
        success: true, 
        badges: [],
        message: 'All eligible badges already earned'
      });
    }

    // Award new badges
    const badgeInserts = newBadges.map(badge => ({
      user_id: user.id,
      badge_id: badge.id,
      notification_shown: false
    }));

    const { data: awardedBadges, error: awardError } = await supabase
      .from('user_badges')
      .insert(badgeInserts)
      .select('id, awarded_at, badge_id');

    if (awardError) {
      console.error('Error awarding badges:', awardError);
      return NextResponse.json({ error: 'Badge award error' }, { status: 500 });
    }

    // Format response with badge details
    const badgeResults = newBadges.map(badge => ({
      id: badge.id,
      name: badge.name,
      label: badge.label,
      description: badge.description,
      shouldShowNotification: true,
      earned_at: awardedBadges?.find(ab => ab.badge_id === badge.id)?.awarded_at
    }));

    return NextResponse.json({
      success: true,
      badges: badgeResults,
      message: `Awarded ${badgeResults.length} new badge(s)!`
    });

  } catch (error) {
    console.error('Error in tabarka-treasures badge endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
