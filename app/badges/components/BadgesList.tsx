'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BadgeCard } from "./BadgeCard";

type BadgeWithStatus = {
  id: string;
  name: string;
  label: string;
  description: string;
  earned: boolean;
  earned_at?: string;
};

type FilterType = 'all' | 'earned' | 'unearned';

export function BadgesList({ badges }: { badges: BadgeWithStatus[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredBadges = badges.filter(badge => {
    if (activeFilter === 'earned') return badge.earned;
    if (activeFilter === 'unearned') return !badge.earned;
    return true;
  });

  return (
    <>
      {/* Badges categories */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-6">
          <Button
            variant={activeFilter === 'all' ? "default" : "outline"}
            onClick={() => setActiveFilter('all')}
            className={`
              shadow-sm border-indigo-100 hover:bg-indigo-50
              ${activeFilter === 'all' ? 'bg-indigo-500' : 'bg-white'}
            `}
          >
            Tous les badges
          </Button>
          <Button
            variant={activeFilter === 'earned' ? "default" : "outline"}
            onClick={() => setActiveFilter('earned')}
            className={`
              shadow-sm border-indigo-100 hover:bg-indigo-50
              ${activeFilter === 'earned' ? 'bg-indigo-500' : 'bg-white'}
            `}
          >
            Obtenus
          </Button>
          <Button
            variant={activeFilter === 'unearned' ? "default" : "outline"}
            onClick={() => setActiveFilter('unearned')}
            className={`
              shadow-sm border-indigo-100 hover:bg-indigo-50
              ${activeFilter === 'unearned' ? 'bg-indigo-500' : 'bg-white'}
            `}
          >
            À débloquer
          </Button>
        </div>
      </div>

      {/* Badges grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBadges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </div>
    </>
  );
}
