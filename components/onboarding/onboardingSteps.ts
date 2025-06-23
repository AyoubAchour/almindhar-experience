export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  targetSelector: string;  
  position: 'top' | 'right' | 'bottom' | 'left';
  requiredAction?: {
    type: 'click' | 'input' | 'navigate';
    value?: string; 
  };
}

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Bienvenue sur Almindhar Experience",
    description: "Découvrez notre plateforme de tourisme unique ! Commençons la visite guidée.",
    targetSelector: "body",
    position: "top"
  },
  {
    id: 2,
    title: "Découvrez nos Expériences",
    description: "Explorez une variété d'expériences touristiques passionnantes dans votre région.",
    targetSelector: "[data-action='browse-experiences']",
    position: "right",
    requiredAction: {
      type: 'navigate',
      value: '/experiences'
    }
  },
  {
    id: 3,
    title: "Votre Profil Personnel",
    description: "Accédez à votre profil pour gérer vos réservations et suivre vos récompenses.",
    targetSelector: "[data-header-profile]",
    position: "bottom"
  },
  {
    id: 4,
    title: "Mini-Jeux Interactifs",
    description: "Participez à des jeux amusants et éducatifs pour découvrir la culture locale de manière interactive !",
    targetSelector: "[data-nav='games']",
    position: "bottom"
  },
  {
    id: 5,
    title: "Collection de Badges",
    description: "Explorez votre collection de badges et découvrez comment en gagner de nouveaux. Chaque badge raconte une histoire !",
    targetSelector: "[data-nav='all-badges']",
    position: "bottom"
  },
  {
    id: 6,
    title: "Système de Récompenses",
    description: "Gagnez des badges et des points en participant à nos expériences et jeux. Débloquez des avantages exclusifs !",
    targetSelector: "[data-nav='rewards']",
    position: "bottom"
  },
  {
    id: 7,
    title: "C'est Parti !",
    description: "Vous êtes prêt à commencer votre aventure avec Almindhar Experience. Profitez de votre voyage !",
    targetSelector: "body",
    position: "top"
  }
];
