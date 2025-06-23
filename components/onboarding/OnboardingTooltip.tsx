'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from './OnboardingContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function OnboardingTooltip() {
  const {
    isActive,
    currentStep,
    getCurrentStepData,
    nextStep,
    previousStep,
    skipOnboarding,
  } = useOnboarding();

  const [tooltipPosition, setTooltipPosition] = React.useState({
    top: 0,
    left: 0,
  });

  const step = getCurrentStepData();
  const isFullScreenStep = step?.targetSelector === 'body';

  React.useEffect(() => {
    if (!step || isFullScreenStep) return;

    const updatePosition = () => {
      const targetElement = document.querySelector(step.targetSelector);
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      const position = { top: 0, left: 0 };

      switch (step.position) {
        case 'top':
          position.top = rect.top - 10;
          position.left = rect.left + rect.width / 2;
          break;
        case 'bottom':
          position.top = rect.bottom + 10;
          position.left = rect.left + rect.width / 2;
          break;
        case 'left':
          position.top = rect.top + rect.height / 2;
          position.left = rect.left - 10;
          break;
        case 'right':
          position.top = rect.top + rect.height / 2;
          position.left = rect.right + 10;
          break;
      }

      setTooltipPosition(position);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [step, isFullScreenStep]);

  if (!isActive || !step || isFullScreenStep) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: step.position === 'top' ? 10 : step.position === 'bottom' ? -10 : 0 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'fixed z-50 w-[320px] rounded-lg bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 p-5 text-white shadow-xl',
          {
            '-translate-x-1/2 -translate-y-full': step.position === 'top',
            '-translate-x-1/2': step.position === 'bottom',
            '-translate-y-1/2 -translate-x-full': step.position === 'left',
            '-translate-y-1/2': step.position === 'right',
          }
        )}
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div className="mb-3 text-lg font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 inline-block text-transparent bg-clip-text">
          {step.title}
        </div>
        <p className="mb-5 text-gray-300 text-sm leading-relaxed">{step.description}</p>
        <div className="flex items-center justify-between border-t border-gray-800 pt-4 mt-2">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={previousStep}
              disabled={currentStep === 0}
              className="border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-indigo-600 text-xs"
            >
              Précédent
            </Button>
            <Button 
              size="sm" 
              onClick={nextStep}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
            >
              Suivant
            </Button>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={skipOnboarding}
            className="text-gray-400 hover:text-gray-300 hover:bg-gray-800 text-xs"
          >
            Passer
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
