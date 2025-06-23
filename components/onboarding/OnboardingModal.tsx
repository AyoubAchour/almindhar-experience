'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from './OnboardingContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function OnboardingModal() {
  const {
    isActive,
    currentStep,
    getCurrentStepData,
    nextStep,
    previousStep,
    skipOnboarding,
  } = useOnboarding();

  const step = getCurrentStepData();
  const isFullScreenStep = step?.targetSelector === 'body';

  if (!isActive || !step || !isFullScreenStep) {
    return null;
  }

  return (
    <Dialog open={isActive} onOpenChange={() => skipOnboarding()}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 inline-block text-transparent bg-clip-text">
            {step.title}
          </DialogTitle>
          <DialogDescription className="pt-4 text-gray-300 text-base leading-relaxed">
            {step.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-between mt-8 border-t border-gray-800 pt-6">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={previousStep}
              disabled={currentStep === 0}
              className="border-indigo-600 bg-transparent text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-indigo-600"
            >
              Précédent
            </Button>
            <Button 
              onClick={nextStep}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {currentStep === 5 ? "C'est parti !" : "Suivant"}
            </Button>
          </div>
          {currentStep !== 5 && (
            <Button 
              variant="ghost" 
              onClick={skipOnboarding}
              className="text-gray-400 hover:text-gray-300 hover:bg-gray-800"
            >
              Passer le tutoriel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
