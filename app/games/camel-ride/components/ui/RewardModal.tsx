'use client';
import React, { useState } from 'react';
import { Gift, Copy, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RewardModalProps {
  reward: {
    id: string;
    name: string;
    description: string;
    coupon_code: string;
    expires_at: string;
  };
  onClose: () => void;
}

export default function RewardModal({ reward, onClose }: RewardModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(reward.coupon_code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };
  const router = useRouter();
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md max-w-sm w-full mx-4 rounded-xl shadow-xl transform transition-transform duration-300 scale-95 animate-scaleIn">
        <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <Gift className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Coupon de réduction</h2>
        </div>
        <div className="px-6 py-4 space-y-4">
          <p className="text-gray-700 dark:text-gray-200">Vous avez gagné :</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-50">{reward.name}</p>
          <div className="flex items-center justify-between font-mono bg-gray-100 dark:bg-gray-700 p-3 rounded text-lg text-indigo-800 dark:text-indigo-300 border-2 border-indigo-200 dark:border-indigo-700">
            <span className="truncate">{reward.coupon_code}</span>
            {isCopied ? (
              <Check
                className="h-5 w-5 text-green-600 dark:text-green-300"
                aria-label="Copié"
              />
            ) : (
              <Copy
                className="h-5 w-5 text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100 cursor-pointer"
                onClick={handleCopy}
                aria-label="Copier le code"
              />
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Expire le : {new Date(reward.expires_at).toLocaleDateString('fr-FR')}</p>
        </div>
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            aria-label="Fermer le modal"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-md transition"
          >
            Fermer
          </button>
          <button
            onClick={() => router.back()}
            aria-label="Retour"
            className="w-full py-2 mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition"
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}

