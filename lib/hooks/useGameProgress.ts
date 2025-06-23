import { useState, useEffect, useCallback } from 'react';

export function useGameProgress(experienceId: string) {
  const [tutorialCompleted, setTutorialCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchProgress() {
      setLoading(true);
      try {
        const res = await fetch(`/api/game-progress/${experienceId}`);
        const data = await res.json();
        if (res.ok && !cancelled) {
          setTutorialCompleted(!!data.tutorialCompleted);
        } else if (!cancelled) {
          setError(data.error || 'Failed to fetch tutorial state');
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProgress();
    return () => { cancelled = true; };
  }, [experienceId]);

  const markTutorialComplete = useCallback(async () => {
    try {
      const res = await fetch(`/api/game-progress/${experienceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tutorialCompleted: true }),
      });
      const data = await res.json();
      if (res.ok && data.tutorialCompleted) {
        setTutorialCompleted(true);
        return true;
      } else {
        setError(data.error || 'Failed to update tutorial state');
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, [experienceId]);

  return { tutorialCompleted, loading, error, markTutorialComplete };
} 