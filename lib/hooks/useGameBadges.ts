import { useState, useCallback } from 'react';
import { useBadgeAward } from '@/contexts/BadgeAwardContext';

export interface GameBadgeData {
  experienceId: string;
  score: number;
  completed: boolean;
  // Desert game specific
  distance?: number;
  // Memory game specific
  timeElapsed?: number;
  attempts?: number;
  totalPairs?: number;
  // Tabarka game specific (for compatibility)
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface AwardedBadge {
  id: string;
  name: string;
  label: string;
  description: string;
  shouldShowNotification: boolean;
  earned_at: string;
}

interface UseGameBadgesResult {
  checkAndAwardBadges: (gameData: GameBadgeData) => Promise<AwardedBadge[]>;
  isLoading: boolean;
  error: string | null;
}

export function useGameBadges(): UseGameBadgesResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showBadgeAward } = useBadgeAward();

  const checkAndAwardBadges = useCallback(async (gameData: GameBadgeData): Promise<AwardedBadge[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🎖️ Checking badges for game data:', gameData);

      const response = await fetch('/api/badges/game-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        throw new Error(`Failed to check badges: ${response.statusText}`);
      }

      const result = await response.json();
      const awardedBadges: AwardedBadge[] = result.badges || [];

      console.log('🎖️ Badges awarded:', awardedBadges);

      // Show badge notifications for each awarded badge
      if (awardedBadges.length > 0) {
        for (let i = 0; i < awardedBadges.length; i++) {
          const badge = awardedBadges[i];
          
          // Add delay between multiple badges
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }

          console.log(`🎖️ Showing badge notification ${i + 1}/${awardedBadges.length}:`, badge);
          showBadgeAward(badge);
        }
      }

      return awardedBadges;

    } catch (err: any) {
      console.error('🎖️ Error checking badges:', err);
      setError(err.message || 'Failed to check badges');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [showBadgeAward]);

  return {
    checkAndAwardBadges,
    isLoading,
    error
  };
} 