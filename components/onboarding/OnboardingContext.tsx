'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useBadgeAward } from '@/contexts/BadgeAwardContext';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { OnboardingStep, onboardingSteps } from './onboardingSteps';

interface OnboardingContextType {
  currentStep: number;
  isActive: boolean;
  isCompleted: boolean;
  startOnboarding: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  getCurrentStepData: () => OnboardingStep | null;
}

interface OnboardingProviderProps {
  children: ReactNode;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch user's onboarding status
  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      setUserId(session.user.id);

      const { data: onboardingData } = await supabase
        .from('user_onboarding_progress')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (onboardingData) {
        console.log('Found onboarding data:', onboardingData);
        setCurrentStep(onboardingData.current_step);
        setIsCompleted(onboardingData.is_completed);
        // Only start onboarding if it wasn't completed AND we're coming from profile completion
        const isFromProfile = new URLSearchParams(window.location.search).get('from') === 'complete-profile';
        if (!onboardingData.is_completed && isFromProfile) {
          console.log('Starting onboarding: not completed and from profile');
          setIsActive(true);
        } else {
          console.log('Not starting onboarding:', { 
            isCompleted: onboardingData.is_completed, 
            isFromProfile 
          });
        }
      } else {
        console.log('No onboarding data found, creating initial record');
        // Create initial onboarding record for new user
        await supabase.from('user_onboarding_progress').insert([
          {
            user_id: session.user.id,
            steps_completed: {},
            current_step: 0,
            is_completed: false
          }
        ]);
        // Only start onboarding if we're coming from profile completion
        const isFromProfile = new URLSearchParams(window.location.search).get('from') === 'complete-profile';
        if (isFromProfile) {
          console.log('Starting onboarding for new user from profile');
          setIsActive(true);
        } else {
          console.log('Not starting onboarding for new user: not from profile');
        }
      }
    };

    fetchOnboardingStatus();
  }, []);

  // Update progress in Supabase
  const updateProgress = async (step: number, completed: boolean = false) => {
    if (!userId) return;

    const stepsCompleted: Record<number, boolean> = {};
    for (let i = 0; i < step; i++) {
      stepsCompleted[i] = true;
    }

    await supabase
      .from('user_onboarding_progress')
      .update({
        current_step: step,
        steps_completed: stepsCompleted,
        is_completed: completed,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
  };

  const startOnboarding = () => {
    setIsActive(true);
    setCurrentStep(0);
    setIsCompleted(false);
  };

  const nextStep = async () => {
    if (currentStep < onboardingSteps.length - 1) {
      const nextStepNumber = currentStep + 1;
      setCurrentStep(nextStepNumber);
      await updateProgress(nextStepNumber);
    } else {
      await completeOnboarding();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = async () => {
    setIsActive(false);
    setIsCompleted(true);
    await updateProgress(onboardingSteps.length, true);
  };

  const { showBadgeAward } = useBadgeAward();

  const completeOnboarding = async () => {
    setIsActive(false);
    setIsCompleted(true);
    await updateProgress(onboardingSteps.length, true);

    // Award the tutorial completion badge
    try {
      const response = await fetch('/api/badges/tutorial-complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success && data.badge && !data.alreadyAwarded) {
        // Show badge award immediately
        showBadgeAward(data.badge);
      }
    } catch (error) {
      console.error('Error awarding tutorial badge:', error);
    }
  };

  const getCurrentStepData = (): OnboardingStep | null => {
    return isActive ? onboardingSteps[currentStep] || null : null;
  };

  const value = {
    currentStep,
    isActive,
    isCompleted,
    startOnboarding,
    nextStep,
    previousStep,
    skipOnboarding,
    completeOnboarding,
    getCurrentStepData
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
