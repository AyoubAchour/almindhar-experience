'use client';

import * as React from 'react';
import { OnboardingModal } from './OnboardingModal';
import { OnboardingTooltip } from './OnboardingTooltip';
import { useOnboarding } from './OnboardingContext';

export function OnboardingUI() {
  const { isActive, getCurrentStepData } = useOnboarding();
  const step = getCurrentStepData();
  const [spotlightRect, setSpotlightRect] = React.useState<DOMRect | null>(null);
  const [isSpotlightVisible, setIsSpotlightVisible] = React.useState(false);

  React.useEffect(() => {
    if (!isActive || !step) {
      setIsSpotlightVisible(false);
      return;
    }

    // For full-screen steps (welcome and final), don't show spotlight
    if (step.targetSelector === 'body') {
      setSpotlightRect(null);
      setIsSpotlightVisible(false);
      return;
    }

    const target = document.querySelector(step.targetSelector);
    if (!target) return;

    // Add a class to the target element to prevent blur
    target.classList.add('onboarding-target');

    const updateSpotlight = () => {
      const rect = target.getBoundingClientRect();
      setSpotlightRect(rect);
      setIsSpotlightVisible(true);
    };

    updateSpotlight();
    window.addEventListener('resize', updateSpotlight);
    window.addEventListener('scroll', updateSpotlight);

    return () => {
      window.removeEventListener('resize', updateSpotlight);
      window.removeEventListener('scroll', updateSpotlight);
      target.classList.remove('onboarding-target');
    };
  }, [isActive, step]);

  if (!isActive || !step) {
    return null;
  }

  const padding = 8; // Padding around the spotlight
  const borderRadius = 8; // Border radius for the spotlight

  return (
    <>
      <OnboardingModal />
      <OnboardingTooltip />
      
      {/* Background overlay with blur */}
      <div
        className="fixed inset-0 z-40 transition-all duration-300"
        style={{
          opacity: isSpotlightVisible ? 1 : 0,
          backdropFilter: 'blur(2px) brightness(0.5)',
          WebkitBackdropFilter: 'blur(2px) brightness(0.5)',
        }}
      />

      {/* Spotlight cutout */}
      {spotlightRect && (
        <div
          className="fixed inset-0 z-41 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, transparent, rgba(0, 0, 0, 0.75))',
          }}
        >
          <div
            className="absolute transition-all duration-300 ease-out bg-transparent"
            style={{
              top: spotlightRect.top - padding,
              left: spotlightRect.left - padding,
              width: spotlightRect.width + (padding * 2),
              height: spotlightRect.height + (padding * 2),
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)',
              borderRadius: `${borderRadius}px`,
              border: '2px solid rgba(255, 255, 255, 0.3)',
              animation: 'spotlight-pulse 2s infinite',
            }}
          />
        </div>
      )}

      {/* Pulse animation keyframes */}
      <style jsx global>{
        `
        .onboarding-target {
          isolation: isolate;
          z-index: 42;
          position: relative;
        }

        @keyframes spotlight-pulse {
          0% {
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.75),
                        0 0 15px rgba(99, 102, 241, 0.4);
            border-color: rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.75),
                        0 0 25px rgba(99, 102, 241, 0.6);
            border-color: rgba(255, 255, 255, 0.5);
          }
          100% {
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.75),
                        0 0 15px rgba(99, 102, 241, 0.4);
            border-color: rgba(255, 255, 255, 0.3);
          }
        }
        `
      }</style>

      {/* Target element highlight */}
      {spotlightRect && (
        <div
          className="fixed z-43 pointer-events-none transition-opacity duration-300"
          style={{
            top: spotlightRect.top,
            left: spotlightRect.left,
            width: spotlightRect.width,
            height: spotlightRect.height,
            opacity: isSpotlightVisible ? 1 : 0,
          }}
        >
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.2))',
              borderRadius: `${borderRadius - 2}px`,
              boxShadow: 'inset 0 0 20px rgba(99, 102, 241, 0.2)',
            }}
          />
        </div>
      )}
    </>
  );
}
