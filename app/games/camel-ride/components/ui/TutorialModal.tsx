"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface TutorialModalProps {
  visible: boolean;
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ visible, onClose }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background border border-border rounded-lg p-6 max-w-xl w-full shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Comment jouer</h2>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li>Utilisez ← et → pour changer de voie.</li>
          <li>Appuyez sur Espace pour sauter.</li>
          <li>Évitez les obstacles.</li>
          <li>Trois collisions et c'est terminé !</li>
        </ul>
        <Button onClick={onClose} className="w-full" variant="default" size="lg">
          Commencer le jeu
        </Button>
      </div>
    </div>
  );
};

export default TutorialModal; 