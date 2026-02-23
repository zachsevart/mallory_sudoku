import type { Difficulty } from '../types/game';

export interface DifficultyConfig {
  label: string;
  minClues: number;
  maxClues: number;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: { label: 'Easy', minClues: 36, maxClues: 40 },
  medium: { label: 'Medium', minClues: 32, maxClues: 35 },
  hard: { label: 'Hard', minClues: 28, maxClues: 31 },
  expert: { label: 'Expert', minClues: 22, maxClues: 27 },
};

export const getClueCount = (difficulty: Difficulty): number => {
  const { minClues, maxClues } = DIFFICULTY_CONFIG[difficulty];
  return Math.floor(Math.random() * (maxClues - minClues + 1)) + minClues;
};
