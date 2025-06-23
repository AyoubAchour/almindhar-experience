'use client';

import React, { useState } from "react";
import { useMemoryGameContext } from "../../context/GameContext";
import { Trophy, Clock, Target, RotateCcw, ArrowLeft, Gift, Copy, CheckCircle, Home, Grid3X3 } from "lucide-react";

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
  onModeSelection: () => void;
  awardedReward?: AwardedReward;
}

const GameEndModal: React.FC<GameEndModalProps> = ({
  visible,
  onRestart,
  onBack,
  onModeSelection,
  awardedReward
}) => {
  const { score, attempts, timeElapsed, matchedPairs, totalPairs, status } = useMemoryGameContext();
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  if (!visible) return null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isGameWon = status === "gameOver" && matchedPairs === totalPairs;
  const isGameLost = status === "gameLost" || (status === "gameOver" && matchedPairs < totalPairs);

  const getGameResult = () => {
    if (isGameWon) {
      return {
        title: "Félicitations ! 🎉",
        subtitle: "Vous avez réussi le défi de mémoire !",
        icon: "🏆",
        bgColor: "from-green-50 to-emerald-50",
        borderColor: "border-green-200"
      };
    } else if (isGameLost) {
      return {
        title: "Pas de chance ! 😔",
        subtitle: "N'abandonnez pas, réessayez !",
        icon: "💪",
        bgColor: "from-orange-50 to-yellow-50",
        borderColor: "border-orange-200"
      };
    } else {
      return {
        title: "Partie terminée",
        subtitle: "Merci d'avoir joué !",
        icon: "🎮",
        bgColor: "from-blue-50 to-indigo-50",
        borderColor: "border-blue-200"
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

        {/* Stats - Only show for completed games */}
        {(isGameWon || isGameLost) && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-yellow-50 p-3 rounded-lg text-center">
              <Trophy className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-yellow-700">{score}</div>
              <div className="text-xs text-yellow-600">Points</div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-blue-700">{formatTime(timeElapsed)}</div>
              <div className="text-xs text-blue-600">Temps</div>
            </div>

            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <Target className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <div className="text-xl font-bold text-purple-700">{attempts}</div>
              <div className="text-xs text-purple-600">Essais</div>
            </div>

            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-green-700">{matchedPairs}/{totalPairs}</div>
              <div className="text-xs text-green-600">Paires</div>
            </div>
          </div>
        )}

        {/* Coupon Section - Only for won games with reward */}
        {isGameWon && awardedReward && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-800">🎉 Récompense gagnée !</h3>
            </div>
            <p className="text-sm text-green-700 mb-3">{awardedReward.description}</p>

            <div className="bg-white p-3 rounded border border-green-200 mb-3">
              <p className="text-xs text-gray-600 mb-1">Code de réduction :</p>
              <div className="flex items-center justify-between">
                <p className="font-mono font-bold text-green-800 text-lg">{awardedReward.coupon_code}</p>
                <button
                  onClick={handleCopyCoupon}
                  className="flex items-center gap-1 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-sm rounded transition-colors"
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

            <p className="text-xs text-green-600">
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
              Rejouer
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
            {isGameWon && awardedReward ? (
              "N'oubliez pas d'utiliser votre code de réduction !"
            ) : isGameWon ? (
              "Excellent travail ! Essayez un mode plus difficile ?"
            ) : isGameLost ? (
              "Réessayez ou changez de difficulté"
            ) : (
              "Choisissez votre prochaine action"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameEndModal;
