'use client';

import React, { useState } from 'react';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward: {
    name: string;
    coupon_code: string;
    discount_percent: number;
    expires_at?: string;
  } | null;
}

const RewardModal: React.FC<RewardModalProps> = ({ isOpen, onClose, reward }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !reward) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(reward.coupon_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy code:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = reward.coupon_code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatExpiryDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100">
        {/* Header with celebration icon */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Félicitations !
          </h2>
          <p className="text-gray-600">
            Vous avez gagné une récompense !
          </p>
        </div>

        {/* Reward details */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            {reward.name}
          </h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {reward.discount_percent || 0}% de réduction
          </div>
          {reward.expires_at && (
            <p className="text-sm text-blue-600">
              Valide jusqu'au {formatExpiryDate(reward.expires_at)}
            </p>
          )}
        </div>

        {/* Coupon code section */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Votre code coupon :
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white border-2 border-dashed border-gray-300 rounded-lg p-3 font-mono text-lg font-bold text-center text-gray-800">
              {reward.coupon_code}
            </div>
            <button
              onClick={handleCopyCode}
              className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {copied ? (
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Copié!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>📋</span>
                  <span>Copier</span>
                </div>
              )}
            </button>
          </div>
          {copied && (
            <p className="text-sm text-green-600 mt-2 text-center">
              Code copié dans le presse-papiers !
            </p>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            💡 <strong>Comment utiliser :</strong> Utilisez ce code lors de votre réservation pour bénéficier de votre réduction.
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default RewardModal;
