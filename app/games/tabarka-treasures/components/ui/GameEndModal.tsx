'use client';

import React, { useState } from "react";
import { Clock, Target, RotateCcw, ArrowLeft, Gift, Copy, CheckCircle, Home, Grid3X3, Coins } from "lucide-react";

interface AwardedReward {
  id: string;
  name: string;
  description: string;
  discount_percent: number;
  coupon_code: string;
  expires_at: string;
}

interface GameEndModalProps {
  visible: boolean;
  onRestart: () => void;
  onBack: () => void;
  onModeSelection: () => void;
  awardedReward?: AwardedReward;
  gameStats: {
    finalScore: number;
    timeRemaining: number;
    difficulty: 'easy' | 'medium' | 'hard';
    gameCompleted: boolean;
  };
}

const GameEndModal: React.FC<GameEndModalProps> = ({
  visible,
  onRestart,
  onBack,
  onModeSelection,
  awardedReward,
  gameStats
}) => {
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  if (!visible) return null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Facile';
      case 'medium': return 'Moyen';
      case 'hard': return 'Difficile';
      default: return difficulty;
    }
  };

  const getGameResult = () => {
    if (gameStats.gameCompleted) {
      return {
        title: "Plongée réussie ! 🎉",
        subtitle: "Vous avez collecté des trésors de Tabarka !",
        icon: "🏆",
        bgColor: "from-blue-50 to-cyan-50",
        borderColor: "border-blue-200"
      };
    } else {
      return {
        title: "Plongée terminée ! ⏰",
        subtitle: "Le temps est écoulé, mais c'est un bon début !",
        icon: "🌊",
        bgColor: "from-orange-50 to-yellow-50",
        borderColor: "border-orange-200"
      };
    }
  };

  const gameResult = getGameResult();

  const handleCopyCoupon = async () => {
    if (awardedReward?.coupon_code) {
      try {
        await navigator.clipboard.writeText(awardedReward.coupon_code);
        setCopiedCoupon(true);
        setTimeout(() => setCopiedCoupon(false), 2000);
      } catch (err) {
        console.error('Failed to copy coupon:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{gameResult.icon}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {gameResult.title}
          </h2>
          <p className="text-gray-600">
            {gameResult.subtitle}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <Coins className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-xl font-bold text-blue-700">{gameStats.finalScore}</div>
            <div className="text-xs text-blue-600">Trésors</div>
          </div>

          {gameStats.timeRemaining > 0 ? (
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <Clock className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-green-700">{formatTime(gameStats.timeRemaining)}</div>
              <div className="text-xs text-green-600">Temps restant</div>
            </div>
          ) : (
            <div className="bg-red-50 p-3 rounded-lg text-center">
              <Clock className="w-5 h-5 text-red-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-red-700">Temps écoulé</div>
              <div className="text-xs text-red-600">Fin du temps</div>
            </div>
          )}

          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <Target className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <div className="text-xl font-bold text-purple-700">{getDifficultyLabel(gameStats.difficulty)}</div>
            <div className="text-xs text-purple-600">Difficulté</div>
          </div>
        </div>

        {/* Coupon Section - Only when reward is earned */}
        {awardedReward && (
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="w-5 h-5 text-cyan-600" />
              <h3 className="font-semibold text-cyan-800">🎉 Récompense gagnée !</h3>
            </div>
            <p className="text-sm text-cyan-700 mb-3">{awardedReward.description}</p>

            <div className="bg-white p-3 rounded border border-cyan-200 mb-3">
              <p className="text-xs text-gray-600 mb-1">Code de réduction :</p>
              <div className="flex items-center justify-between">
                <p className="font-mono font-bold text-cyan-800 text-lg">{awardedReward.coupon_code}</p>
                <button
                  onClick={handleCopyCoupon}
                  className="flex items-center gap-1 px-3 py-1 bg-cyan-100 hover:bg-cyan-200 text-cyan-700 text-sm rounded transition-colors"
                >
                  {copiedCoupon ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copier
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs text-cyan-600">
              Expire le : {new Date(awardedReward.expires_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Primary Action - Return to Experience (most prominent) */}
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            Retour à l'Expérience
          </button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onRestart}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-3 rounded-lg transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Replonger
            </button>

            <button
              onClick={onModeSelection}
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-3 rounded-lg transition-colors text-sm"
            >
              <Grid3X3 className="w-4 h-4" />
              Modes
            </button>
          </div>

          {/* Contextual Messages */}
          <div className="text-center text-xs text-gray-500 mt-2">
            {awardedReward ? (
              "N'oubliez pas d'utiliser votre code de réduction !"
            ) : gameStats.finalScore >= 150 ? (
              "Excellent plongée ! Essayez un mode plus difficile ?"
            ) : (
              "Continuez à vous entraîner pour améliorer votre score !"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameEndModal; 