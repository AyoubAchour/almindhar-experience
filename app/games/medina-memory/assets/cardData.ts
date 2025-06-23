/**
 * Placeholder card data for Medina Memory Match game
 * Phase 1: Using colors, text labels, and emoji
 */

export interface CardItem {
  id: number;
  type: string;
  label: string;
  labelArabic?: string;
  color: string;
  emoji: string;
  description: string;
  culturalFact: string;
}

export const CULTURAL_ITEMS: CardItem[] = [
  {
    id: 1,
    type: 'pottery',
    label: 'Poterie',
    labelArabic: 'فخار',
    color: '#8B4513', // Saddle brown
    emoji: '🏺',
    description: 'Céramiques traditionnelles de Nabeul, célèbres pour leurs motifs colorés et leur artisanat ancestral.',
    culturalFact: "Les potiers de Nabeul utilisent encore aujourd'hui les mêmes techniques que leurs ancêtres phéniciens d'il y a 3000 ans."
  },
  {
    id: 2,
    type: 'carpet',
    label: 'Tapis',
    labelArabic: 'سجادة',
    color: '#DC143C', // Crimson
    emoji: '🧶',
    description: 'Tapis berbères tissés à la main avec des motifs géométriques traditionnels transmis de génération en génération.',
    culturalFact: "Chaque tapis berbère raconte une histoire unique à travers ses motifs géométriques transmis de mère en fille depuis des siècles."
  },
  {
    id: 3,
    type: 'jewelry',
    label: 'Bijoux',
    labelArabic: 'مجوهرات',
    color: '#FFD700', // Gold
    emoji: '💍',
    description: 'Bijoux en argent filigrane, technique d\'orfèvrerie délicate typique de l\'artisanat tunisien.',
    culturalFact: "L'art du filigrane tunisien, technique d'orfèvrerie délicate, était déjà pratiqué dans les souks de Tunis au 12ème siècle."
  },
  {
    id: 4,
    type: 'leather',
    label: 'Cuir',
    labelArabic: 'جلد',
    color: '#A0522D', // Sienna
    emoji: '👡',
    description: 'Babouches et maroquinerie en cuir travaillé selon les méthodes traditionnelles de la médina.',
    culturalFact: "Les babouches tunisiennes sont cousues entièrement à la main selon une tradition artisanale vieille de plus de 1000 ans."
  },
  {
    id: 5,
    type: 'metalwork',
    label: 'Métal',
    labelArabic: 'معدن',
    color: '#B87333', // Dark goldenrod
    emoji: '🫖',
    description: 'Objets en cuivre et laiton martelés à la main : théières, plateaux et lanternes ornementales.',
    culturalFact: "Les artisans de la médina martèlent encore le cuivre à la main pour créer des théières selon des techniques héritées de l'époque ottomane."
  },
  {
    id: 6,
    type: 'textiles',
    label: 'Textile',
    labelArabic: 'نسيج',
    color: '#4169E1', // Royal blue
    emoji: '🧵',
    description: 'Tissus brodés et étoffes traditionnelles aux motifs floraux et géométriques colorés.',
    culturalFact: "Les broderies tunisiennes utilisent des fils d'or et d'argent dans des motifs inspirés de l'art islamique et berbère."
  },
  {
    id: 7,
    type: 'masks',
    label: 'Masques',
    labelArabic: 'أقنعة',
    color: '#8B008B', // Dark magenta
    emoji: '🎭',
    description: 'Masques traditionnels utilisés dans les festivals et cérémonies culturelles tunisiennes.',
    culturalFact: "Les masques tunisiens sont utilisés depuis l'époque carthaginoise dans les rituels de protection et les célébrations du nouvel an berbère."
  },
  {
    id: 8,
    type: 'amphoras',
    label: 'Amphores',
    labelArabic: 'جرار',
    color: '#CD853F', // Peru
    emoji: '🏺',
    description: 'Amphores antiques utilisées pour le stockage et le transport des denrées.',
    culturalFact: "Les amphores de Carthage étaient si réputées dans l'Antiquité qu'elles servaient d'étalon commercial dans tout le bassin méditerranéen."
  },
  {
    id: 9,
    type: 'architecture',
    label: 'Architecture',
    labelArabic: 'عمارة',
    color: '#2F4F4F', // Dark slate gray
    emoji: '🕌',
    description: 'Éléments architecturaux islamiques caractéristiques de la médina de Tunis.',
    culturalFact: "La Grande Mosquée de Tunis, construite en 732, est l'un des plus anciens monuments de l'architecture islamique au Maghreb."
  },
  {
    id: 10,
    type: 'calligraphy',
    label: 'Calligraphie',
    labelArabic: 'خط عربي',
    color: '#191970', // Midnight blue
    emoji: '📿',
    description: 'Art de la calligraphie arabe pratiqué dans les manuscrits et décorations.',
    culturalFact: "L'école de calligraphie de Kairouan a développé un style unique appelé 'Maghribi' qui influence encore l'art calligraphique tunisien aujourd'hui."
  }
];

/**
 * Game mode interface for difficulty levels
 */
export interface GameMode {
  id: 'discovery' | 'artisan' | 'master';
  name: string;
  nameArabic: string;
  description: string;
  difficulty: {
    gridSize: { cols: number; rows: number };
    totalPairs: number;
    previewTime: number; // seconds
    flipBackDelay: number; // milliseconds
    timeLimit?: number; // seconds (undefined = no limit)
    maxAttempts?: number; // undefined = unlimited
    shuffleAfterMistakes?: number;
    maxConsecutiveMistakes?: number;
  };
  rewards: {
    discountPercentage: number;
    badgeId: string;
    couponCode: string;
  };
  unlockRequirement?: string; // mode that must be completed first
}

/**
 * Game modes configuration
 */
export const GAME_MODES: GameMode[] = [
  {
    id: 'discovery',
    name: 'Découverte',
    nameArabic: 'استكشاف',
    description: '6 paires • Temps libre • Parfait pour débuter',
    difficulty: {
      gridSize: { cols: 4, rows: 3 },
      totalPairs: 6,
      previewTime: 4,
      flipBackDelay: 1000,
    },
    rewards: {
      discountPercentage: 5,
      badgeId: 'medina_explorer',
      couponCode: 'MEDINA5'
    }
  },
  {
    id: 'artisan',
    name: 'Artisan',
    nameArabic: 'حرفي',
    description: '8 paires • 5 minutes • 20 erreurs max',
    difficulty: {
      gridSize: { cols: 4, rows: 4 },
      totalPairs: 8,
      previewTime: 3,
      flipBackDelay: 700,
      timeLimit: 300, // 5 minutes
      maxAttempts: 20
    },
    rewards: {
      discountPercentage: 10,
      badgeId: 'master_artisan',
      couponCode: 'MEDINA10'
    },
    unlockRequirement: 'discovery'
  },
  {
    id: 'master',
    name: 'Maître',
    nameArabic: 'أستاذ',
    description: '10 paires • 4 minutes • 12 erreurs max',
    difficulty: {
      gridSize: { cols: 5, rows: 4 },
      totalPairs: 10,
      previewTime: 2,
      flipBackDelay: 500,
      timeLimit: 240, // 4 minutes
      maxAttempts: 12,
      shuffleAfterMistakes: 3,
      maxConsecutiveMistakes: 3
    },
    rewards: {
      discountPercentage: 15,
      badgeId: 'grand_master_medina',
      couponCode: 'MEDINA15'
    },
    unlockRequirement: 'artisan'
  }
];

/**
 * Generate card pairs for the memory game based on selected mode
 * Each cultural item appears twice in the deck
 */
export const generateCardDeck = (mode: GameMode): CardItem[] => {
  const deck: CardItem[] = [];
  const itemsToUse = CULTURAL_ITEMS.slice(0, mode.difficulty.totalPairs);

  itemsToUse.forEach((item, index) => {
    // Add first card of the pair
    deck.push({ ...item, id: index * 2 + 1 });
    // Add second card of the pair
    deck.push({ ...item, id: index * 2 + 2 });
  });

  return shuffleDeck(deck);
};

/**
 * Shuffle the card deck using Fisher-Yates algorithm
 */
export const shuffleDeck = (deck: CardItem[]): CardItem[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Card back styling configuration
 */
export const CARD_BACK_STYLE = {
  background: 'linear-gradient(45deg, #1e40af, #3b82f6)',
  backgroundImage: `
    repeating-linear-gradient(
      45deg, 
      transparent, 
      transparent 10px, 
      rgba(255,255,255,0.1) 10px, 
      rgba(255,255,255,0.1) 20px
    )
  `,
  border: '2px solid #1d4ed8',
  borderRadius: '8px'
};

/**
 * Game configuration (base settings + backward compatibility)
 */
export const GAME_CONFIG = {
  GRID_COLS: 4, // Default for discovery mode
  GRID_ROWS: 3, // Default for discovery mode
  TOTAL_CARDS: 12, // Default for discovery mode
  TOTAL_PAIRS: 6, // Default for discovery mode
  CARD_WIDTH: 100,
  CARD_HEIGHT: 100,
  CARD_SPACING: 8
};

/**
 * Get dynamic game configuration based on mode
 */
export const getGameConfig = (mode: GameMode) => ({
  ...GAME_CONFIG,
  GRID_COLS: mode.difficulty.gridSize.cols,
  GRID_ROWS: mode.difficulty.gridSize.rows,
  TOTAL_CARDS: mode.difficulty.totalPairs * 2,
  TOTAL_PAIRS: mode.difficulty.totalPairs,
});
