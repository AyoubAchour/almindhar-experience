'use client';
import React from "react";
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

interface MenuProps {
  visible: boolean;
  onRestart: () => void;
}

const Menu: React.FC<MenuProps> = ({ visible, onRestart }) => {
  if (!visible) return null;
  const router = useRouter();
  
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
          onClick={() => router.back()}
          className="w-full max-w-xs mx-auto block py-3 mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
        >
          Retour
        </button>
      </div>
    </div>
  );
};

export default Menu; 