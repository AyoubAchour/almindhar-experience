'use client';
import React, { useState } from 'react';
import { Gift, Copy, Check, RefreshCw } from 'lucide-react';

interface AwardedReward {
  id: string;
  name: string;
  description: string;
  coupon_code: string;
  expires_at: string;
}

interface GameEndModalProps {
  visible: boolean;
  onRestart: () => void;
  onBack: () => void;
  awardedReward?: AwardedReward;
}

export default function GameEndModal({ visible, onRestart, onBack, awardedReward }: GameEndModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  if (!visible) return null;

  if (awardedReward) {
    // Coupon win UI
    const handleCopy = () => {
      navigator.clipboard.writeText(awardedReward.coupon_code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    };
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm max-w-sm w-full mx-4 rounded-2xl shadow-2xl p-6 animate-scaleIn">
          <div className="flex items-center space-x-2 mb-4">
            <Gift className="h-8 w-8 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Coupon de réduction</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-200">Vous avez gagné :</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">{awardedReward.name}</p>
          <div className="flex items-center justify-between font-mono bg-gray-100 dark:bg-gray-700 p-3 rounded text-lg text-indigo-800 dark:text-indigo-300 border-2 border-indigo-200 dark:border-indigo-700 mb-2">
            <span className="truncate">{awardedReward.coupon_code}</span>
            {isCopied ? (
              <Check className="h-5 w-5 text-green-600 dark:text-green-300" aria-label="Copié" />
            ) : (
              <Copy className="h-5 w-5 text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100 cursor-pointer" onClick={handleCopy} aria-label="Copier le code" />
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Expire le : {new Date(awardedReward.expires_at).toLocaleDateString('fr-FR')}</p>
          <button
            onClick={onBack}
            aria-label="Retour"
            className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  // Game over (lose) UI
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm max-w-md w-full mx-4 rounded-2xl shadow-2xl p-6 animate-scaleIn">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <RefreshCw className="h-8 w-8 text-indigo-600" />
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Fin de la partie</h2>
        </div>
        <p className="text-base text-gray-600 dark:text-gray-300 text-center mb-6">
          Appuyez sur <span className="font-semibold">Entrée</span> pour recommencer
        </p>
        <button
          aria-label="Recommencer"
          onClick={onRestart}
          className="w-full max-w-xs mx-auto block py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
        >
          Recommencer
        </button>
        <button
          aria-label="Retour"
          onClick={onBack}
          className="w-full max-w-xs mx-auto block py-3 mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
        >
          Retour
        </button>
      </div>
    </div>
  );
} 