'use client';

import React from 'react';
import { CardItem } from '../../assets/cardData';

interface CulturalInfoModalProps {
  isVisible: boolean;
  cardItem: CardItem | null;
  onClose: () => void;
}

const CulturalInfoModal: React.FC<CulturalInfoModalProps> = ({
  isVisible,
  cardItem,
  onClose
}) => {
  if (!isVisible || !cardItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-70 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-xl shadow-2xl max-w-md mx-4 p-6 transform transition-all duration-300 scale-100"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          border: '2px solid #d4af37',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(212,175,55,0.1)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          aria-label="Fermer"
        >
          <svg 
            className="w-5 h-5 text-gray-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">{cardItem.emoji}</div>
          <h2 
            className="text-2xl font-bold text-gray-800 mb-2"
            style={{ color: '#1e40af' }}
          >
            {cardItem.label}
          </h2>
          <div 
            className="text-lg text-gray-600"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            {cardItem.labelArabic}
          </div>
        </div>

        {/* Cultural Fact */}
        <div className="mb-6">
          <div 
            className="text-base leading-relaxed text-gray-700 text-center italic"
            style={{ 
              lineHeight: '1.6',
              fontSize: '16px'
            }}
          >
            "{cardItem.culturalFact}"
          </div>
        </div>

        {/* Decorative Element */}
        <div className="flex justify-center mb-6">
          <div 
            className="w-16 h-1 rounded-full"
            style={{ 
              background: 'linear-gradient(90deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)' 
            }}
          />
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            style={{
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              boxShadow: '0 4px 15px rgba(30, 64, 175, 0.3)'
            }}
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CulturalInfoModal;
