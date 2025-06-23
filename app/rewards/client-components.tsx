'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

// This file will be expanded with more client-side functionality
// as we implement the actual rewards system

export default function RewardsClientComponents() {
  return (
    <div>
      {/* Client-side components will be added here */}
    </div>
  );
}

// Reward card with interactive elements - will be used in future implementation
export function RewardCard({ 
  reward, 
  userProgress = 0,
  isEarned = false 
}: { 
  reward: any, 
  userProgress?: number,
  isEarned?: boolean 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const progressPercentage = Math.min(100, (userProgress / reward.requirements.count) * 100);
  
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            {reward.requirements.type === 'bookings' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            {reward.requirements.type === 'games' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {reward.requirements.type === 'referrals' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800">{reward.title}</h3>
        <p className="text-gray-600 mb-4">{reward.description}</p>
        
        {isEarned ? (
          <div className="bg-green-100 text-green-800 rounded-lg p-3 mb-4 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Récompense Débloquée!</p>
              <p className="text-sm">Vous pouvez utiliser cette récompense lors de votre prochaine réservation.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Progression:</span>
              <span className="text-sm font-medium">{userProgress}/{reward.requirements.count}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full mb-4">
              <div 
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            <span className="font-medium">Validité:</span> {reward.validityPeriod}
          </div>
          <div className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full">
            {reward.requirements.type === 'bookings' && `${reward.requirements.count} réservation${reward.requirements.count > 1 ? 's' : ''}`}
            {reward.requirements.type === 'games' && `${reward.requirements.count} jeu${reward.requirements.count > 1 ? 'x' : ''}`}
            {reward.requirements.type === 'referrals' && `${reward.requirements.count} parrainage${reward.requirements.count > 1 ? 's' : ''}`}
          </div>
        </div>
        
        {isEarned ? (
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            Utiliser la Récompense
          </Button>
        ) : (
          <Link 
            href={`/rewards/${reward.id}`}
            className="block text-center border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg py-2 transition-all duration-300"
          >
            Voir les Détails
          </Link>
        )}
      </div>
    </div>
  );
}

// Progress tracker component - will be used in future implementation
export function ProgressTracker({ 
  userStats 
}: { 
  userStats: {
    bookings: number,
    gamesCompleted: number,
    referrals: number
  } 
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      <h3 className="text-lg font-bold mb-4">Votre Progression</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-600">Réservations</span>
            <span className="font-medium">{userStats.bookings}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${Math.min(100, (userStats.bookings / 5) * 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-600">Jeux Complétés</span>
            <span className="font-medium">{userStats.gamesCompleted}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${Math.min(100, (userStats.gamesCompleted / 10) * 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-600">Parrainages</span>
            <span className="font-medium">{userStats.referrals}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${Math.min(100, (userStats.referrals / 3) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
