export function getBadgeIcon(badgeName: string) {
  const iconMap: Record<string, { emoji: string, color: string }> = {
    'nouvel_aventurier': { 
      emoji: '🏅', 
      color: 'from-yellow-400 to-orange-400'
    },
    'premier_booking': { 
      emoji: '🎫', 
      color: 'from-green-400 to-teal-500'
    },
    'explorateur_desert': { 
      emoji: '🏜️', 
      color: 'from-orange-400 to-red-500'
    },
    'explorateur_curieux': { 
      emoji: '🔍', 
      color: 'from-purple-400 to-indigo-500'
    },
    'explorateur_culture': { 
      emoji: '🏛️', 
      color: 'from-purple-400 to-indigo-500'
    },
    'explorateur_nature': { 
      emoji: '🌲', 
      color: 'from-green-500 to-emerald-600'
    },
    'master_jeux': { 
      emoji: '🎮', 
      color: 'from-indigo-400 to-purple-500'
    },
    'premier_pas_tutorial': {
      emoji: '🎯',
      color: 'from-blue-400 to-cyan-500'
    },
    // Desert Game Badges
    'premier_chamelier': {
      emoji: '🐪',
      color: 'from-orange-400 to-yellow-500'
    },
    'voyageur_desert': {
      emoji: '🏜️',
      color: 'from-orange-500 to-red-500'
    },
    'maitre_chamelier': {
      emoji: '👑',
      color: 'from-yellow-400 to-orange-500'
    },
    
    // Memory Game Badges
    'memory_first_game': {
      emoji: '🧠',
      color: 'from-blue-400 to-purple-500'
    },
    'memory_speed_demon': {
      emoji: '⚡',
      color: 'from-yellow-400 to-red-500'
    },
    'memory_perfect': {
      emoji: '💯',
      color: 'from-green-400 to-blue-500'
    },

    // Tabarka Treasures Game Badges
    'premier_plongeur': {
      emoji: '🤿',
      color: 'from-cyan-400 to-blue-500'
    },
    'collecteur_tresor': {
      emoji: '💎',
      color: 'from-purple-400 to-pink-500'
    },
    'maitre_plongeur': {
      emoji: '🏆',
      color: 'from-yellow-400 to-orange-500'
    },
    'explorateur_tabarka': {
      emoji: '🗺️',
      color: 'from-green-400 to-teal-500'
    },

    // Cross-Game Badges
    'explorateur_tunisie': {
      emoji: '🇹🇳',
      color: 'from-red-500 to-green-500'
    }
  };

  return iconMap[badgeName] || {
    emoji: '🎯',
    color: 'from-gray-400 to-gray-500'
  };
}
