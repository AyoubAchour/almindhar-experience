'use client';

import { useSearchParams } from 'next/navigation';
import { useOnboarding } from '@/components/onboarding/OnboardingContext';
import { BadgeAwardModal } from './BadgeAwardModal';

export function ClientBadgeWrapper() {
  const searchParams = useSearchParams();
  const { startOnboarding } = useOnboarding();

  const handleBadgeClose = () => {
    console.log('ClientBadgeWrapper: handleBadgeClose called');
    const shouldStartOnboarding = window.localStorage.getItem('onboarding_trigger') === 'complete-profile';
    console.log('Should start onboarding:', shouldStartOnboarding);

    if (shouldStartOnboarding) {
      console.log('Starting onboarding in 300ms...');
      // Remove the trigger from localStorage
      window.localStorage.removeItem('onboarding_trigger');
      // Small delay to ensure modal is fully closed
      setTimeout(() => {
        console.log('Starting onboarding now!');
        startOnboarding();
      }, 300);
    }
  };

  return <BadgeAwardModal onClose={handleBadgeClose} />;
}
