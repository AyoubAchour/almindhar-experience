import { useState, useCallback } from 'react';

interface AwardedReward {
  id: string;
  name: string;
  description: string;
  discount_percent: number;
  coupon_code: string;
  expires_at: string;
}

interface UseGameScoreResult {
  submitScore: (score: number) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  newScore: any | null;
  awardedReward: AwardedReward | null;
}

export function useGameScore(experienceId: string): UseGameScoreResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newScore, setNewScore] = useState<any | null>(null);
  const [awardedReward, setAwardedReward] = useState<AwardedReward | null>(null);

  const submitScore = useCallback(async (score: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/games/scores/${experienceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit score');
        return false;
      }
      setNewScore(data.newScore);
      if (data.awardedReward) {
        setAwardedReward(data.awardedReward);
      }
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [experienceId]);

  return { submitScore, isLoading, error, newScore, awardedReward };
} 