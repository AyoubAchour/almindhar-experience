"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { CardItem, GameMode, GAME_MODES } from "../assets/cardData";
import { useMemoryGameAudio } from "../hooks/useMemoryGameAudio";

// Game state interface for Memory Match
export interface MemoryGameState {
  status: "modeSelection" | "preview" | "ready" | "playing" | "paused" | "gameOver" | "gameLost";
  score: number;
  attempts: number;
  matchedPairs: number;
  totalPairs: number;
  timeElapsed: number;
  selectedCards: number[];
  cards: CardItem[];
  revealedCards: Set<number>;
  matchedCards: Set<number>;
  showCulturalInfo: boolean;
  currentCulturalCard: CardItem | null;
  isTimerPaused: boolean;

  // Mode-specific state
  currentMode: GameMode | null;
  wrongAttempts: number;
  consecutiveMistakes: number;
  timeRemaining?: number;
  loseReason?: 'timeout' | 'maxAttempts' | 'consecutiveMistakes';
  completedModes: string[];
}

// Default state
const defaultState: MemoryGameState = {
  status: "ready",
  score: 0,
  attempts: 0,
  matchedPairs: 0,
  totalPairs: 6,
  timeElapsed: 0,
  selectedCards: [],
  cards: [],
  revealedCards: new Set(),
  matchedCards: new Set(),
  showCulturalInfo: false,
  currentCulturalCard: null,
  isTimerPaused: false,

  // Mode-specific state
  currentMode: null,
  wrongAttempts: 0,
  consecutiveMistakes: 0,
  completedModes: [],
};

// Context type
interface MemoryGameContextType extends MemoryGameState {
  setStatus: (status: MemoryGameState["status"]) => void;
  setScore: (score: number) => void;
  setAttempts: (attempts: number) => void;
  setMatchedPairs: (pairs: number) => void;
  setTimeElapsed: (time: number) => void;
  setSelectedCards: (cards: number[]) => void;
  setCards: (cards: CardItem[]) => void;
  setRevealedCards: (cards: Set<number>) => void;
  setMatchedCards: (cards: Set<number>) => void;
  setShowCulturalInfo: (show: boolean) => void;
  setCurrentCulturalCard: (card: CardItem | null) => void;
  setIsTimerPaused: (paused: boolean) => void;
  setCurrentMode: (mode: GameMode | null) => void;
  setWrongAttempts: (attempts: number) => void;
  setConsecutiveMistakes: (mistakes: number) => void;
  setTimeRemaining: (time: number | undefined) => void;
  setCompletedModes: (modes: string[]) => void;
  resetGame: () => void;
  restartCurrentMode: () => void;

  // Game actions
  selectCard: (cardIndex: number) => void;
  checkMatch: () => void;
  incrementAttempts: () => void;
  closeCulturalInfo: () => void;
  selectMode: (mode: GameMode) => void;
  startPreview: () => void;
  startGame: () => void;
}

const MemoryGameContext = createContext<MemoryGameContextType | undefined>(undefined);

export const MemoryGameProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<MemoryGameState["status"]>(defaultState.status);
  const [score, setScore] = useState(defaultState.score);
  const [attempts, setAttempts] = useState(defaultState.attempts);
  const [matchedPairs, setMatchedPairs] = useState(defaultState.matchedPairs);
  const [totalPairs, setTotalPairs] = useState(defaultState.totalPairs);
  const [timeElapsed, setTimeElapsed] = useState(defaultState.timeElapsed);
  const [selectedCards, setSelectedCards] = useState<number[]>(defaultState.selectedCards);
  const [cards, setCards] = useState<CardItem[]>(defaultState.cards);
  const [revealedCards, setRevealedCards] = useState<Set<number>>(defaultState.revealedCards);
  const [matchedCards, setMatchedCards] = useState<Set<number>>(defaultState.matchedCards);
  const [showCulturalInfo, setShowCulturalInfo] = useState(defaultState.showCulturalInfo);
  const [currentCulturalCard, setCurrentCulturalCard] = useState<CardItem | null>(defaultState.currentCulturalCard);
  const [isTimerPaused, setIsTimerPaused] = useState(defaultState.isTimerPaused);

  // Mode-specific state
  const [currentMode, setCurrentMode] = useState<GameMode | null>(defaultState.currentMode);
  const [wrongAttempts, setWrongAttempts] = useState(defaultState.wrongAttempts);
  const [consecutiveMistakes, setConsecutiveMistakes] = useState(defaultState.consecutiveMistakes);
  const [timeRemaining, setTimeRemaining] = useState<number | undefined>(defaultState.timeRemaining);
  const [completedModes, setCompletedModes] = useState<string[]>(defaultState.completedModes);

  // Audio system integration
  const audioTriggers = useMemoryGameAudio(
    status === "playing", // isPlaying
    status, // gameStatus
    0.7 // masterVolume
  );

  const resetGame = () => {
    setStatus("ready");
    setScore(0);
    setAttempts(0);
    setMatchedPairs(0);
    setTimeElapsed(0);
    setSelectedCards([]);
    setCards([]);
    setRevealedCards(new Set());
    setMatchedCards(new Set());
    setShowCulturalInfo(false);
    setCurrentCulturalCard(null);
    setIsTimerPaused(false);
  };

  const restartCurrentMode = () => {
    if (!currentMode) return;

    // Keep the current mode but reset game state
    setScore(0);
    setAttempts(0);
    setMatchedPairs(0);
    setTimeElapsed(0);
    setSelectedCards([]);
    setRevealedCards(new Set());
    setMatchedCards(new Set());
    setShowCulturalInfo(false);
    setCurrentCulturalCard(null);
    setIsTimerPaused(false);
    setWrongAttempts(0);
    setConsecutiveMistakes(0);
    // Reset time remaining if there's a time limit
    if (currentMode.difficulty.timeLimit) {
      setTimeRemaining(currentMode.difficulty.timeLimit);
    }

    // Generate new shuffled cards for the same mode
    const { generateCardDeck } = require('../assets/cardData');
    const newDeck = generateCardDeck(currentMode);
    setCards(newDeck);

    // Go directly to preview phase to restart the same mode
    setStatus("preview");
  };

  // Close cultural info modal and resume game
  const closeCulturalInfo = () => {
    setShowCulturalInfo(false);
    setCurrentCulturalCard(null);
    setIsTimerPaused(false);
  };

  // Mode selection and game flow
  const selectMode = (mode: GameMode) => {
    // Reset all game state when selecting a new mode
    setScore(0);
    setAttempts(0);
    setMatchedPairs(0);
    setTimeElapsed(0);
    setSelectedCards([]);
    setRevealedCards(new Set());
    setMatchedCards(new Set());
    setShowCulturalInfo(false);
    setCurrentCulturalCard(null);
    setIsTimerPaused(false);
    setWrongAttempts(0);
    setConsecutiveMistakes(0);

    // Set new mode configuration
    setCurrentMode(mode);
    setTotalPairs(mode.difficulty.totalPairs);
    setTimeRemaining(mode.difficulty.timeLimit);

    // Generate new cards for the selected mode
    const { generateCardDeck } = require('../assets/cardData');
    const newDeck = generateCardDeck(mode);
    setCards(newDeck);

    setStatus("preview");
  };

  const startPreview = () => {
    setStatus("preview");
  };

  const startGame = () => {
    setStatus("playing");
    setWrongAttempts(0);
    setConsecutiveMistakes(0);
    setIsTimerPaused(false);
  };

  // Game action: Select a card
  const selectCard = (cardIndex: number) => {
    if (status !== "playing") return;
    if (selectedCards.length >= 2) return;
    if (selectedCards.includes(cardIndex)) return;
    if (matchedCards.has(cardIndex)) return;

    // Trigger card selection sound
    audioTriggers.triggerCardSelect();

    const newSelected = [...selectedCards, cardIndex];
    setSelectedCards(newSelected);

    // Reveal the card with flip sound
    const newRevealed = new Set(revealedCards);
    newRevealed.add(cardIndex);
    setRevealedCards(newRevealed);

    // Trigger card flip sound
    audioTriggers.triggerCardFlip();

    // If two cards selected, check for match after a brief delay
    if (newSelected.length === 2) {
      setTimeout(() => {
        checkMatch(newSelected);
      }, 1000);
    }
  };

  // Game action: Check if selected cards match
  const checkMatch = (cardsToCheck?: number[]) => {
    const currentSelected = cardsToCheck || selectedCards;
    if (currentSelected.length !== 2) return;

    const [firstIndex, secondIndex] = currentSelected;
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];

    if (firstCard && secondCard && firstCard.type === secondCard.type) {
      // Match found! Trigger success sound
      audioTriggers.triggerMatchSuccess();

      const newMatched = new Set(matchedCards);
      newMatched.add(firstIndex);
      newMatched.add(secondIndex);
      setMatchedCards(newMatched);

      const newMatchedPairs = matchedPairs + 1;
      setMatchedPairs(newMatchedPairs);

      // Calculate score (base points + time bonus)
      const basePoints = 100;
      const timeBonus = Math.max(0, 60 - timeElapsed); // Bonus for speed
      setScore(score + basePoints + timeBonus);

      // Show cultural information modal
      setCurrentCulturalCard(firstCard);
      setShowCulturalInfo(true);
      setIsTimerPaused(true);

      // Check win condition
      if (newMatchedPairs === totalPairs) {
        setStatus("gameOver");
      }
    } else {
      // No match - trigger fail sound and hide cards again
      audioTriggers.triggerMatchFail();

      const newRevealed = new Set(revealedCards);
      newRevealed.delete(currentSelected[0]);
      newRevealed.delete(currentSelected[1]);
      setRevealedCards(newRevealed);
    }

    // Clear selected cards
    setSelectedCards([]);
    incrementAttempts();
  };

  // Game action: Increment attempt counter
  const incrementAttempts = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Check if max attempts exceeded
    if (currentMode?.difficulty.maxAttempts && newAttempts >= currentMode.difficulty.maxAttempts) {
      setStatus("gameLost");
    }
  };



  return (
    <MemoryGameContext.Provider
      value={{
        status,
        score,
        attempts,
        matchedPairs,
        totalPairs,
        timeElapsed,
        selectedCards,
        cards,
        revealedCards,
        matchedCards,
        showCulturalInfo,
        currentCulturalCard,
        isTimerPaused,
        currentMode,
        wrongAttempts,
        consecutiveMistakes,
        timeRemaining,
        completedModes,
        setStatus,
        setScore,
        setAttempts,
        setMatchedPairs,
        setTimeElapsed,
        setSelectedCards,
        setCards,
        setRevealedCards,
        setMatchedCards,
        setShowCulturalInfo,
        setCurrentCulturalCard,
        setIsTimerPaused,
        setCurrentMode,
        setWrongAttempts,
        setConsecutiveMistakes,
        setTimeRemaining,
        setCompletedModes,
        resetGame,
        restartCurrentMode,
        selectCard,
        checkMatch,
        incrementAttempts,
        closeCulturalInfo,
        selectMode,
        startPreview,
        startGame,
      }}
    >
      {children}
    </MemoryGameContext.Provider>
  );
};

// Hook to use the memory game context
export function useMemoryGameContext() {
  const ctx = useContext(MemoryGameContext);
  if (!ctx) throw new Error("useMemoryGameContext must be used within a MemoryGameProvider");
  return ctx;
}
