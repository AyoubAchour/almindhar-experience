'use client';

import { Badge } from "@/components/ui/badge";
import { getBadgeIcon } from "@/utils/badges";

type BadgeWithStatus = {
  id: string;
  name: string;
  label: string;
  description: string;
  earned: boolean;
  earned_at?: string;
};

export function BadgeCard({ badge }: { badge: BadgeWithStatus }) {
  const { earned, name, label, description, earned_at } = badge;
  const badgeIcon = getBadgeIcon(name);
  const isNewAdventurer = name.toLowerCase() === 'nouvel_aventurier';

  return (
    <div className={`
      relative rounded-xl overflow-hidden border transition-all duration-300
      ${earned 
        ? 'border-indigo-200 bg-white shadow-md hover:shadow-lg hover:translate-y-[-2px]' 
        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}
      p-6 flex flex-col h-full
    `}>
      <div className="flex items-start mb-4">
        <div className={`
          w-12 h-12 rounded-lg flex items-center justify-center mr-4
          ${earned 
            ? `bg-gradient-to-br ${badgeIcon.color} text-white shadow-sm` 
            : 'bg-gray-200 text-gray-400'}
          ${isNewAdventurer && earned ? 'ring-2 ring-yellow-300 ring-offset-2' : ''}
        `}>
          <span className="text-2xl">{badgeIcon.emoji}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-800 mb-1">{label}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
        
        {!earned ? (
          <div className="ml-2">
            <span className="bg-gray-200 text-gray-500 rounded-full p-1.5 inline-flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
          </div>
        ) : (
          <div className="ml-2">
            <span className="bg-green-100 text-green-600 rounded-full p-1.5 inline-flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          </div>
        )}
      </div>
      
      {earned && earned_at && (
        <div className="mt-auto pt-3">
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
            Obtenu le {new Date(earned_at).toLocaleDateString('fr-FR')}
          </Badge>
        </div>
      )}
    </div>
  );
}
