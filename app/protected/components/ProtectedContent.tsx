"use client";

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useBadgeAward } from '@/contexts/BadgeAwardContext';
import { useOnboarding } from '@/components/onboarding/OnboardingContext';
import type { BadgeAwardData } from '@/contexts/BadgeAwardContext';

export default function ProtectedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showBadgeAward } = useBadgeAward();
  const { startOnboarding } = useOnboarding();
  const [hasCheckedBadge, setHasCheckedBadge] = useState(false);

  useEffect(() => {
    const checkBadgeAward = async () => {
      if (searchParams.get('from') === 'complete-profile' && !hasCheckedBadge) {
        setHasCheckedBadge(true);
        try {
          const response = await fetch('/api/badges/award', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          
          if (data.success && data.badge) {
            const badgeData = data.badge as BadgeAwardData;
            // Store the 'from' parameter in localStorage
            if (searchParams.get('from') === 'complete-profile') {
              window.localStorage.setItem('onboarding_trigger', 'complete-profile');
            }
            showBadgeAward(badgeData);
            // Remove the 'from' parameter from the URL
            const newUrl = '/protected';
            router.replace(newUrl);
          }
        } catch (error) {
          console.error('Error awarding badge:', error);
        }
      }
    };

    checkBadgeAward();
  }, [searchParams, showBadgeAward, router]);

  return null;
}
