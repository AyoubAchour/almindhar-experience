'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

// This file will be expanded with game-specific client-side functionality
// as we implement the actual games

export default function GameClientComponents() {
  return (
    <div>
      {/* Game-specific client components will be added here */}
    </div>
  );
}

// Game placeholder component - will be replaced with actual game implementation
export function GamePlaceholder({ 
  gameTitle, 
  comingSoon = true 
}: { 
  gameTitle: string,
  comingSoon?: boolean
}) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 aspect-video flex items-center justify-center">
      <div className="text-center p-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-bold mb-2">Jeu {gameTitle}</h3>
        {comingSoon ? (
          <p className="text-gray-500">
            Le jeu sera bientôt disponible à cet emplacement. En attendant, vous pouvez explorer les autres jeux.
          </p>
        ) : (
          <p className="text-gray-500">
            Cliquez sur le bouton "Jouer Maintenant" pour commencer.
          </p>
        )}
      </div>
    </div>
  );
}

// Score display component - will be used when games are implemented
export function ScoreDisplay({ 
  score, 
  threshold, 
  hasEarnedCoupon 
}: { 
  score: number, 
  threshold: number,
  hasEarnedCoupon: boolean
}) {
  const percentage = Math.min(100, (score / threshold) * 100);
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      <h3 className="text-lg font-bold mb-4">Votre Score</h3>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600">Score actuel:</span>
        <span className="font-bold text-xl">{score}</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-600">Objectif:</span>
        <span className="font-medium">{threshold}</span>
      </div>
      
      {/* Progress bar */}
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div 
          className={`h-full ${hasEarnedCoupon ? 'bg-green-500' : 'bg-indigo-600'}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      {hasEarnedCoupon ? (
        <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-green-800 font-medium">Félicitations!</p>
            <p className="text-green-700 text-sm">Vous avez débloqué un coupon de réduction. Consultez votre profil pour l'utiliser.</p>
          </div>
        </div>
      ) : (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
          <p className="text-indigo-800 text-sm">
            {score > 0 
              ? `Il vous manque ${threshold - score} points pour débloquer le coupon de réduction.`
              : `Jouez pour gagner ${threshold} points et débloquer un coupon de réduction.`
            }
          </p>
        </div>
      )}
    </div>
  );
}
