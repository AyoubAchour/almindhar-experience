import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Experience IDs for each game
const EXPERIENCE_IDS = {
  DESERT: 'b08cb7e5-7d27-468b-9478-54e78f793e96',
  MEMORY: 'f5974dbf-ea5e-4c1d-8e04-1740c55c87a9', 
  TABARKA: 'eb7a5889-b330-4338-8bb7-a7a8bcb61a5d'
} as const;

interface GameBadgeData {
  experienceId: string;
  score: number;
  completed: boolean;
  distance?: number;
  timeElapsed?: number;
  attempts?: number;
  totalPairs?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface BadgeEligibility {
  name: string;
  label: string;
  description: string;
  eligible: boolean;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Parse request body
    const gameData: GameBadgeData = await request.json();
    const { experienceId, score, completed } = gameData;

    console.log('🎖️ Processing badge request for experience:', experienceId, gameData);

    // Route to appropriate game badge logic
    let badgeEligibility: BadgeEligibility[] = [];
    
    switch (experienceId) {
      case EXPERIENCE_IDS.DESERT:
        badgeEligibility = await getDesertBadgeEligibility(gameData, user.id, supabase);
        break;
      case EXPERIENCE_IDS.MEMORY:
        badgeEligibility = await getMemoryBadgeEligibility(gameData, user.id, supabase);
        break;
      case EXPERIENCE_IDS.TABARKA:
        badgeEligibility = await getTabarkaBadgeEligibility(gameData, user.id, supabase);
        break;
      default:
        return NextResponse.json({ error: 'Unknown experience ID' }, { status: 400 });
    }

    // Filter eligible badges
    const eligibleBadgeNames = badgeEligibility.filter(b => b.eligible).map(b => b.name);
    
    if (eligibleBadgeNames.length === 0) {
      return NextResponse.json({ 
        success: true, 
        badges: [],
        message: 'No new badges earned this game'
      });
    }

    // Get badge definitions from database
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

    // Check for cross-game badges after awarding game-specific badges
    const crossGameBadges = await checkCrossGameBadges(user.id, supabase);
    
    // Format response with badge details
    const badgeResults = newBadges.map(badge => ({
      id: badge.id,
      name: badge.name,
      label: badge.label,
      description: badge.description,
      shouldShowNotification: true,
      earned_at: awardedBadges?.find(ab => ab.badge_id === badge.id)?.awarded_at
    }));

    // Add cross-game badges to results
    badgeResults.push(...crossGameBadges);

    console.log('🎖️ Successfully awarded badges:', badgeResults);

    return NextResponse.json({
      success: true,
      badges: badgeResults,
      message: `Awarded ${badgeResults.length} new badge(s)!`
    });

  } catch (error) {
    console.error('Error in game-completion badge endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Desert game badge logic
async function getDesertBadgeEligibility(
  gameData: GameBadgeData, 
  userId: string, 
  supabase: any
): Promise<BadgeEligibility[]> {
  const { score, completed, distance = 0 } = gameData;

  // Get user's game completion count for Desert
  const { data: gameHistory } = await supabase
    .from('game_scores')
    .select('id, score, completed')
    .eq('user_id', userId)
    .eq('experience_id', EXPERIENCE_IDS.DESERT)
    .eq('completed', true);

  const completedGamesCount = gameHistory?.length || 0;
  const isFirstGame = completedGamesCount === 1; // This is the first completed game (just submitted)

  return [
    {
      name: 'premier_chamelier',
      label: 'Premier Chamelier',
      description: 'Complété votre premier voyage dans le désert',
      eligible: isFirstGame && completed
    },
    {
      name: 'voyageur_desert',
      label: 'Voyageur du Désert', 
      description: 'Parcouru 500+ mètres en un seul voyage',
      eligible: distance >= 500 && completed
    },
    {
      name: 'maitre_chamelier',
      label: 'Maître Chamelier',
      description: 'Atteint un score de 80+ points (800+ mètres)',
      eligible: score >= 80 && completed
    }
  ];
}

// Memory game badge logic
async function getMemoryBadgeEligibility(
  gameData: GameBadgeData,
  userId: string,
  supabase: any
): Promise<BadgeEligibility[]> {
  const { score, completed, timeElapsed = 0, attempts = 0, totalPairs = 0 } = gameData;

  // Get user's game completion count for Memory
  const { data: gameHistory } = await supabase
    .from('game_scores')
    .select('id, score, completed')
    .eq('user_id', userId)
    .eq('experience_id', EXPERIENCE_IDS.MEMORY)
    .eq('completed', true);

  const completedGamesCount = gameHistory?.length || 0;
  const isFirstGame = completedGamesCount === 1; // This is the first completed game (just submitted)

  return [
    {
      name: 'memory_first_game',
      label: 'Premier Jeu',
      description: 'Complété votre premier jeu de mémoire',
      eligible: isFirstGame && completed
    },
    {
      name: 'memory_speed_demon',
      label: 'Rapide comme l\'éclair',
      description: 'Complété le jeu en moins de 60 secondes',
      eligible: timeElapsed < 60 && completed
    },
    {
      name: 'memory_perfect',
      label: 'Mémoire Parfaite',
      description: 'Complété le jeu sans erreurs',
      eligible: attempts <= totalPairs && completed && totalPairs > 0
    }
  ];
}

// Tabarka game badge logic (existing logic for compatibility)
async function getTabarkaBadgeEligibility(
  gameData: GameBadgeData,
  userId: string,
  supabase: any
): Promise<BadgeEligibility[]> {
  const { score, completed } = gameData;

  // Get user's game completion count for Tabarka
  const { data: gameHistory } = await supabase
    .from('game_scores')
    .select('id, score, completed')
    .eq('user_id', userId)
    .eq('experience_id', EXPERIENCE_IDS.TABARKA)
    .eq('completed', true);

  const completedGamesCount = gameHistory?.length || 0;
  const isFirstGame = completedGamesCount === 1; // This is the first completed game (just submitted)
  const totalGamesAfterThis = completedGamesCount + (completed ? 1 : 0);

  return [
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
}

// Check for cross-game badges
async function checkCrossGameBadges(userId: string, supabase: any): Promise<any[]> {
  try {
    // Check if user has completed all three games
    const experienceIds = [EXPERIENCE_IDS.DESERT, EXPERIENCE_IDS.MEMORY, EXPERIENCE_IDS.TABARKA];
    
    const completionChecks = await Promise.all(
      experienceIds.map(async (expId) => {
        const { data } = await supabase
          .from('game_scores')
          .select('id')
          .eq('user_id', userId)
          .eq('experience_id', expId)
          .eq('completed', true)
          .limit(1);
        return data && data.length > 0;
      })
    );

    const hasCompletedAllGames = completionChecks.every(Boolean);

    if (!hasCompletedAllGames) {
      return []; // Not eligible for cross-game badges yet
    }

    // Check if user already has the cross-game badge
    const { data: existingCrossGameBadge } = await supabase
      .from('user_badges')
      .select('badge_id, badges(name)')
      .eq('user_id', userId)
      .eq('badges.name', 'explorateur_tunisie');

    if (existingCrossGameBadge && existingCrossGameBadge.length > 0) {
      return []; // Already has the badge
    }

    // Get the cross-game badge definition
    const { data: crossGameBadge } = await supabase
      .from('badges')
      .select('id, name, label, description')
      .eq('name', 'explorateur_tunisie')
      .single();

    if (!crossGameBadge) {
      return []; // Badge doesn't exist in database yet
    }

    // Award the cross-game badge
    const { data: awardedBadge, error: awardError } = await supabase
      .from('user_badges')
      .insert({
        user_id: userId,
        badge_id: crossGameBadge.id,
        notification_shown: false
      })
      .select('id, awarded_at')
      .single();

    if (awardError) {
      console.error('Error awarding cross-game badge:', awardError);
      return [];
    }

    return [{
      id: crossGameBadge.id,
      name: crossGameBadge.name,
      label: crossGameBadge.label,
      description: crossGameBadge.description,
      shouldShowNotification: true,
      earned_at: awardedBadge.awarded_at
    }];

  } catch (error) {
    console.error('Error checking cross-game badges:', error);
    return [];
  }
} 