import {
  createContext,
  useReducer,
  useCallback,
  type ReactNode,
  type Dispatch,
} from 'react';
import type { GameState, GameAction, Difficulty, CellValue } from '../types/game';
import {
  generatePuzzle,
  createEmptyNotes,
  createInitialMask,
} from '../utils/generator';
import { findErrors, isBoardSolved } from '../utils/validator';

function createInitialState(difficulty: Difficulty): GameState {
  const { puzzle, solution } = generatePuzzle(difficulty);
  return {
    board: puzzle,
    solution,
    initial: createInitialMask(puzzle),
    notes: createEmptyNotes(),
    selected: null,
    history: [],
    future: [],
    difficulty,
    isComplete: false,
    isPaused: false,
    isNotesMode: false,
    errors: findErrors(puzzle),
    startTime: Date.now(),
    elapsedTime: 0,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_CELL': {
      return { ...state, selected: action.position };
    }

    case 'SET_VALUE': {
      if (!state.selected) return state;
      const [row, col] = state.selected;

      if (state.initial[row][col]) return state;

      const previousValue = state.board[row][col];
      const previousNotes = new Set(state.notes[row][col]);

      if (previousValue === action.value) return state;

      const newBoard = state.board.map((r) => [...r]) as CellValue[][];
      newBoard[row][col] = action.value;

      const newNotes = state.notes.map((r) => r.map((n) => new Set(n)));
      newNotes[row][col].clear();

      const newErrors = findErrors(newBoard);
      const isComplete = isBoardSolved(newBoard, state.solution);

      return {
        ...state,
        board: newBoard,
        notes: newNotes,
        errors: newErrors,
        isComplete,
        history: [
          ...state.history,
          {
            position: state.selected,
            previousValue,
            previousNotes,
            newValue: action.value,
            newNotes: new Set(),
          },
        ],
        future: [],
      };
    }

    case 'TOGGLE_NOTE': {
      if (!state.selected) return state;
      const [row, col] = state.selected;

      if (state.initial[row][col]) return state;
      if (state.board[row][col] !== 0) return state;

      const previousNotes = new Set(state.notes[row][col]);
      const newNotes = state.notes.map((r) => r.map((n) => new Set(n)));

      if (newNotes[row][col].has(action.value)) {
        newNotes[row][col].delete(action.value);
      } else {
        newNotes[row][col].add(action.value);
      }

      return {
        ...state,
        notes: newNotes,
        history: [
          ...state.history,
          {
            position: state.selected,
            previousValue: 0,
            previousNotes,
            newValue: 0,
            newNotes: new Set(newNotes[row][col]),
          },
        ],
        future: [],
      };
    }

    case 'TOGGLE_NOTES_MODE': {
      return { ...state, isNotesMode: !state.isNotesMode };
    }

    case 'CLEAR_CELL': {
      if (!state.selected) return state;
      const [row, col] = state.selected;

      if (state.initial[row][col]) return state;

      const previousValue = state.board[row][col];
      const previousNotes = new Set(state.notes[row][col]);

      if (previousValue === 0 && previousNotes.size === 0) return state;

      const newBoard = state.board.map((r) => [...r]) as CellValue[][];
      newBoard[row][col] = 0;

      const newNotes = state.notes.map((r) => r.map((n) => new Set(n)));
      newNotes[row][col].clear();

      const newErrors = findErrors(newBoard);

      return {
        ...state,
        board: newBoard,
        notes: newNotes,
        errors: newErrors,
        history: [
          ...state.history,
          {
            position: state.selected,
            previousValue,
            previousNotes,
            newValue: 0,
            newNotes: new Set(),
          },
        ],
        future: [],
      };
    }

    case 'UNDO': {
      if (state.history.length === 0) return state;

      const lastEntry = state.history[state.history.length - 1];
      const [row, col] = lastEntry.position;

      const newBoard = state.board.map((r) => [...r]) as CellValue[][];
      newBoard[row][col] = lastEntry.previousValue;

      const newNotes = state.notes.map((r) => r.map((n) => new Set(n)));
      newNotes[row][col] = new Set(lastEntry.previousNotes);

      const newErrors = findErrors(newBoard);

      return {
        ...state,
        board: newBoard,
        notes: newNotes,
        errors: newErrors,
        history: state.history.slice(0, -1),
        future: [lastEntry, ...state.future],
        selected: lastEntry.position,
      };
    }

    case 'REDO': {
      if (state.future.length === 0) return state;

      const nextEntry = state.future[0];
      const [row, col] = nextEntry.position;

      const newBoard = state.board.map((r) => [...r]) as CellValue[][];
      newBoard[row][col] = nextEntry.newValue;

      const newNotes = state.notes.map((r) => r.map((n) => new Set(n)));
      newNotes[row][col] = new Set(nextEntry.newNotes);

      const newErrors = findErrors(newBoard);
      const isComplete = isBoardSolved(newBoard, state.solution);

      return {
        ...state,
        board: newBoard,
        notes: newNotes,
        errors: newErrors,
        isComplete,
        history: [...state.history, nextEntry],
        future: state.future.slice(1),
        selected: nextEntry.position,
      };
    }

    case 'NEW_GAME': {
      return createInitialState(action.difficulty);
    }

    case 'PAUSE': {
      return { ...state, isPaused: true };
    }

    case 'RESUME': {
      return { ...state, isPaused: false };
    }

    case 'TICK': {
      if (state.isPaused || state.isComplete) return state;
      return { ...state, elapsedTime: state.elapsedTime + 1 };
    }

    default:
      return state;
  }
}

interface GameContextValue {
  state: GameState;
  dispatch: Dispatch<GameAction>;
  newGame: (difficulty: Difficulty) => void;
}

export const GameContext = createContext<GameContextValue | null>(null);

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(
    gameReducer,
    'medium',
    createInitialState
  );

  const newGame = useCallback((difficulty: Difficulty) => {
    dispatch({ type: 'NEW_GAME', difficulty });
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch, newGame }}>
      {children}
    </GameContext.Provider>
  );
}
