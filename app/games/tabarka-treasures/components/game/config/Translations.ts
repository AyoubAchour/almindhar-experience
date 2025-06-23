export const translations = {
  ui: {
    score: 'Score',
    time: 'Temps',
    difficulty: 'Difficulté',
    paused: 'EN PAUSE',
    gameOver: 'Fin de Partie',
    finalScore: 'Score Final',
    timeRemaining: 'Temps restant',
    timeUp: 'Temps écoulé',
    restart: 'Recommencer',
    backToMenu: 'Retour au Menu',
  },
  difficulties: {
    easy: 'FACILE',
    medium: 'MOYEN',
    hard: 'DIFFICILE',
  },
  timeFormat: {
    minutes: 'm',
    seconds: 's',
  },
  messages: {
    gameStarted: 'Jeu commencé',
    gamePaused: 'Jeu en pause',
    gameResumed: 'Jeu repris',
    developerModeEnabled: 'Mode développeur activé',
    developerModeDisabled: 'Mode développeur désactivé',
  },
  console: {
    gameStarted: 'Jeu commencé - Difficulté',
    gamePaused: '🎮 Jeu mis en pause par la barre d\'espace',
    gameResumed: '🎮 Jeu repris par la barre d\'espace',
    pausedForSettings: 'Jeu mis en pause pour les paramètres (la musique continue)',
    resumedFromSettings: 'Jeu repris depuis les paramètres',
    remainsPausedAfterSettings: 'Le jeu reste en pause par la barre d\'espace après la fermeture des paramètres',
    keyboardControlsEnabled: '🎮 Contrôles pause/reprise par barre d\'espace activés',
    keyboardNotAvailable: '⚠️ Entrée clavier non disponible',
  }
};

export type TranslationKey = keyof typeof translations; 