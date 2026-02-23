import {
  createContext,
  useReducer,
  useCallback,
  type ReactNode,
  type Dispatch,
} from 'react';
import type {
  PipsState,
  PipsAction,
  PuzzleDefinition,
  Domino,
  CellOccupancy,
  Position,
  Orientation,
  PlacementEntry,
} from '../types/pips';
import { findViolations, isPuzzleSolved, canPlaceDomino } from '../utils/validator';

function createEmptyBoard(rows: number, cols: number, inactiveCells?: Position[]): CellOccupancy[][] {
  const inactiveSet = new Set(inactiveCells?.map(([r, c]) => `${r},${c}`) ?? []);
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      dominoId: null,
      half: null,
      inactive: inactiveSet.has(`${r},${c}`),
    }))
  );
}

function createInitialState(puzzle: PuzzleDefinition): PipsState {
  const dominoes: Domino[] = puzzle.dominoes.map((d, i) => ({
    id: `dom-${i}`,
    values: d.values,
    orientation: 'horizontal' as const,
  }));

  return {
    puzzle,
    dominoes,
    placed: new Map(),
    board: createEmptyBoard(puzzle.gridSize.rows, puzzle.gridSize.cols, puzzle.inactiveCells),
    selectedDominoId: null,
    violations: new Set(),
    history: [],
    future: [],
    isComplete: false,
    elapsedTime: 0,
    isPaused: false,
  };
}

function placeDominoOnBoard(
  board: CellOccupancy[][],
  dominoId: string,
  position: Position,
  orientation: Orientation
): void {
  const [row, col] = position;
  const [r2, c2]: Position = orientation === 'horizontal'
    ? [row, col + 1]
    : [row + 1, col];
  board[row][col] = { dominoId, half: 'first', inactive: false };
  board[r2][c2] = { dominoId, half: 'second', inactive: false };
}

function removeDominoFromBoard(board: CellOccupancy[][], dominoId: string): void {
  for (const row of board) {
    for (let c = 0; c < row.length; c++) {
      if (row[c].dominoId === dominoId) {
        row[c] = { dominoId: null, half: null, inactive: row[c].inactive };
      }
    }
  }
}

function cloneBoard(board: CellOccupancy[][]): CellOccupancy[][] {
  return board.map(row => row.map(cell => ({ ...cell })));
}

function pipsReducer(state: PipsState, action: PipsAction): PipsState {
  switch (action.type) {
    case 'SELECT_DOMINO':
      return { ...state, selectedDominoId: action.dominoId };

    case 'PLACE_DOMINO': {
      const { dominoId, position, orientation } = action;
      if (!canPlaceDomino(state, position, orientation, dominoId)) return state;

      const domino = state.dominoes.find(d => d.id === dominoId);
      if (!domino) return state;

      const prevPlacement = state.placed.get(dominoId);

      const newBoard = cloneBoard(state.board);
      if (prevPlacement) {
        removeDominoFromBoard(newBoard, dominoId);
      }
      placeDominoOnBoard(newBoard, dominoId, position, orientation);

      const newPlaced = new Map(state.placed);
      newPlaced.set(dominoId, { dominoId, position, orientation });

      const newDominoes = state.dominoes.map(d =>
        d.id === dominoId ? { ...d, orientation } : d
      );

      const entry: PlacementEntry = {
        dominoId,
        prevPosition: prevPlacement?.position ?? null,
        prevOrientation: prevPlacement?.orientation ?? domino.orientation,
        newPosition: position,
        newOrientation: orientation,
      };

      const newState: PipsState = {
        ...state,
        dominoes: newDominoes,
        placed: newPlaced,
        board: newBoard,
        selectedDominoId: null,
        history: [...state.history, entry],
        future: [],
      };

      newState.violations = findViolations(newState);
      newState.isComplete = isPuzzleSolved(newState);

      return newState;
    }

    case 'REMOVE_DOMINO': {
      const placement = state.placed.get(action.dominoId);
      if (!placement) return state;

      const domino = state.dominoes.find(d => d.id === action.dominoId);
      if (!domino) return state;

      const newBoard = cloneBoard(state.board);
      removeDominoFromBoard(newBoard, action.dominoId);

      const newPlaced = new Map(state.placed);
      newPlaced.delete(action.dominoId);

      const entry: PlacementEntry = {
        dominoId: action.dominoId,
        prevPosition: placement.position,
        prevOrientation: placement.orientation,
        newPosition: null,
        newOrientation: domino.orientation,
      };

      const newState: PipsState = {
        ...state,
        placed: newPlaced,
        board: newBoard,
        history: [...state.history, entry],
        future: [],
      };

      newState.violations = findViolations(newState);
      newState.isComplete = false;

      return newState;
    }

    case 'ROTATE_DOMINO': {
      const domino = state.dominoes.find(d => d.id === action.dominoId);
      if (!domino) return state;

      const newOrientation: Orientation =
        domino.orientation === 'horizontal' ? 'vertical' : 'horizontal';

      const placement = state.placed.get(action.dominoId);

      if (placement) {
        // Rotating a placed domino — check if new orientation fits
        if (!canPlaceDomino(state, placement.position, newOrientation, action.dominoId)) {
          return state;
        }

        const newBoard = cloneBoard(state.board);
        removeDominoFromBoard(newBoard, action.dominoId);
        placeDominoOnBoard(newBoard, action.dominoId, placement.position, newOrientation);

        const newPlaced = new Map(state.placed);
        newPlaced.set(action.dominoId, { ...placement, orientation: newOrientation });

        const entry: PlacementEntry = {
          dominoId: action.dominoId,
          prevPosition: placement.position,
          prevOrientation: placement.orientation,
          newPosition: placement.position,
          newOrientation,
        };

        const newDominoes = state.dominoes.map(d =>
          d.id === action.dominoId ? { ...d, orientation: newOrientation } : d
        );

        const newState: PipsState = {
          ...state,
          dominoes: newDominoes,
          placed: newPlaced,
          board: newBoard,
          history: [...state.history, entry],
          future: [],
        };

        newState.violations = findViolations(newState);
        newState.isComplete = isPuzzleSolved(newState);

        return newState;
      }

      // Not placed — just toggle orientation in tray
      return {
        ...state,
        dominoes: state.dominoes.map(d =>
          d.id === action.dominoId ? { ...d, orientation: newOrientation } : d
        ),
      };
    }

    case 'UNDO': {
      if (state.history.length === 0) return state;

      const entry = state.history[state.history.length - 1];
      const newBoard = cloneBoard(state.board);
      const newPlaced = new Map(state.placed);

      // Remove current placement
      removeDominoFromBoard(newBoard, entry.dominoId);
      newPlaced.delete(entry.dominoId);

      // Restore previous placement if it existed
      if (entry.prevPosition) {
        placeDominoOnBoard(newBoard, entry.dominoId, entry.prevPosition, entry.prevOrientation);
        newPlaced.set(entry.dominoId, {
          dominoId: entry.dominoId,
          position: entry.prevPosition,
          orientation: entry.prevOrientation,
        });
      }

      const newDominoes = state.dominoes.map(d =>
        d.id === entry.dominoId ? { ...d, orientation: entry.prevOrientation } : d
      );

      const newState: PipsState = {
        ...state,
        dominoes: newDominoes,
        placed: newPlaced,
        board: newBoard,
        history: state.history.slice(0, -1),
        future: [entry, ...state.future],
      };

      newState.violations = findViolations(newState);
      newState.isComplete = isPuzzleSolved(newState);

      return newState;
    }

    case 'REDO': {
      if (state.future.length === 0) return state;

      const entry = state.future[0];
      const newBoard = cloneBoard(state.board);
      const newPlaced = new Map(state.placed);

      // Remove old placement
      removeDominoFromBoard(newBoard, entry.dominoId);
      newPlaced.delete(entry.dominoId);

      // Apply new placement
      if (entry.newPosition) {
        placeDominoOnBoard(newBoard, entry.dominoId, entry.newPosition, entry.newOrientation);
        newPlaced.set(entry.dominoId, {
          dominoId: entry.dominoId,
          position: entry.newPosition,
          orientation: entry.newOrientation,
        });
      }

      const newDominoes = state.dominoes.map(d =>
        d.id === entry.dominoId ? { ...d, orientation: entry.newOrientation } : d
      );

      const newState: PipsState = {
        ...state,
        dominoes: newDominoes,
        placed: newPlaced,
        board: newBoard,
        history: [...state.history, entry],
        future: state.future.slice(1),
      };

      newState.violations = findViolations(newState);
      newState.isComplete = isPuzzleSolved(newState);

      return newState;
    }

    case 'NEW_GAME':
      return createInitialState(action.puzzle);

    case 'RESET':
      return createInitialState(state.puzzle);

    case 'TICK':
      if (state.isPaused || state.isComplete) return state;
      return { ...state, elapsedTime: state.elapsedTime + 1 };

    case 'PAUSE':
      return { ...state, isPaused: true };

    case 'RESUME':
      return { ...state, isPaused: false };

    default:
      return state;
  }
}

interface PipsContextValue {
  state: PipsState;
  dispatch: Dispatch<PipsAction>;
  newGame: (puzzle: PuzzleDefinition) => void;
}

export const PipsContext = createContext<PipsContextValue | null>(null);

interface PipsProviderProps {
  children: ReactNode;
  initialPuzzle: PuzzleDefinition;
}

export function PipsProvider({ children, initialPuzzle }: PipsProviderProps) {
  const [state, dispatch] = useReducer(pipsReducer, initialPuzzle, createInitialState);

  const newGame = useCallback((puzzle: PuzzleDefinition) => {
    dispatch({ type: 'NEW_GAME', puzzle });
  }, []);

  return (
    <PipsContext.Provider value={{ state, dispatch, newGame }}>
      {children}
    </PipsContext.Provider>
  );
}
