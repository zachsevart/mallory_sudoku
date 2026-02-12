export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Board = CellValue[][];

export type Position = [row: number, col: number];

export interface CellState {
  value: CellValue;
  isInitial: boolean;
  notes: Set<number>;
  isError: boolean;
}

export interface HistoryEntry {
  position: Position;
  previousValue: CellValue;
  previousNotes: Set<number>;
  newValue: CellValue;
  newNotes: Set<number>;
}

export interface GameState {
  board: CellValue[][];
  solution: CellValue[][];
  initial: boolean[][];
  notes: Set<number>[][];
  selected: Position | null;
  history: HistoryEntry[];
  future: HistoryEntry[];
  difficulty: Difficulty;
  isComplete: boolean;
  isPaused: boolean;
  isNotesMode: boolean;
  errors: boolean[][];
  startTime: number;
  elapsedTime: number;
}

export interface GameStats {
  gamesPlayed: Record<Difficulty, number>;
  gamesCompleted: Record<Difficulty, number>;
  bestTimes: Record<Difficulty, number | null>;
  currentStreak: number;
  bestStreak: number;
}

export type GameAction =
  | { type: 'SELECT_CELL'; position: Position }
  | { type: 'SET_VALUE'; value: CellValue }
  | { type: 'TOGGLE_NOTE'; value: number }
  | { type: 'TOGGLE_NOTES_MODE' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'NEW_GAME'; difficulty: Difficulty }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'TICK' }
  | { type: 'CLEAR_CELL' };
