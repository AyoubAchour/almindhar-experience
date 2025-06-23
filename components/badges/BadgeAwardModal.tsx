'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBadgeAward } from "@/contexts/BadgeAwardContext";
import { getBadgeIcon } from '@/utils/badges';
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface BadgeAwardModalProps {
  onClose?: () => void;
}

export function BadgeAwardModal({ onClose }: BadgeAwardModalProps = {}) {
  const { currentBadge, isVisible, hideBadgeAward } = useBadgeAward();
  const router = useRouter();

  const handleClose = () => {
    console.log('BadgeAwardModal: handleClose called');
    hideBadgeAward();
    if (onClose) {
      console.log('BadgeAwardModal: calling onClose callback');
      onClose();
    }
  };

  if (!currentBadge) return null;

  const { color } = getBadgeIcon(currentBadge.name);

  const viewAllBadges = () => {
    hideBadgeAward();
    router.push('/badges');
  };

  return (
    <Dialog open={isVisible} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 inline-block text-transparent bg-clip-text">
            Nouveau Badge Obtenu !
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className={`bg-gradient-to-r ${color} p-6 rounded-xl text-center shadow-xl border border-white/10`}
        >
          <span className="text-6xl block mb-4">{getBadgeIcon(currentBadge.name).emoji}</span>
          <h3 className="text-xl font-bold text-white mb-2">{currentBadge.label}</h3>
          <p className="text-white/90">{currentBadge.description}</p>
        </motion.div>

        <DialogFooter className="sm:justify-between mt-8 border-t border-gray-800 pt-6">
          <Button
            variant="outline"
            onClick={viewAllBadges}
            className="border-indigo-600 bg-transparent text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
          >
            Voir Tous les Badges
          </Button>
          <Button 
            onClick={handleClose}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Continuer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
