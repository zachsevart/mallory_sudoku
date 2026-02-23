export type PipValue = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Orientation = 'horizontal' | 'vertical';

export type ConstraintType =
  | 'equals'         // = : all values must be equal
  | 'not-equals'     // ≠ : all values must be unique
  | 'sum'            // Σ : values must sum to target
  | 'greater-than'   // > : all values must be > target
  | 'less-than'      // < : all values must be < target
  | 'none';          // no constraint

export interface Constraint {
  type: ConstraintType;
  target?: number;
}

export type Position = [row: number, col: number];

export interface Region {
  id: string;
  cells: Position[];
  constraint: Constraint;
  color: string;
}

export interface DominoDef {
  values: [PipValue, PipValue];
}

export interface Domino {
  id: string;
  values: [PipValue, PipValue];
  orientation: Orientation;
}

export interface PlacedDomino {
  dominoId: string;
  position: Position;
  orientation: Orientation;
}

export interface CellOccupancy {
  dominoId: string | null;
  half: 'first' | 'second' | null;
  inactive: boolean;
}

export interface PuzzleDefinition {
  id: string;
  gridSize: { rows: number; cols: number };
  regions: Region[];
  dominoes: DominoDef[];
  inactiveCells?: Position[];
}

export interface PlacementEntry {
  dominoId: string;
  prevPosition: Position | null;
  prevOrientation: Orientation;
  newPosition: Position | null;
  newOrientation: Orientation;
}

export interface PipsState {
  puzzle: PuzzleDefinition;
  dominoes: Domino[];
  placed: Map<string, PlacedDomino>;      // dominoId -> placement
  board: CellOccupancy[][];
  selectedDominoId: string | null;
  violations: Set<string>;                 // region IDs that are violated
  history: PlacementEntry[];
  future: PlacementEntry[];
  isComplete: boolean;
  elapsedTime: number;
  isPaused: boolean;
}

export type PipsAction =
  | { type: 'SELECT_DOMINO'; dominoId: string | null }
  | { type: 'PLACE_DOMINO'; dominoId: string; position: Position; orientation: Orientation }
  | { type: 'REMOVE_DOMINO'; dominoId: string }
  | { type: 'ROTATE_DOMINO'; dominoId: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'NEW_GAME'; puzzle: PuzzleDefinition }
  | { type: 'RESET' }
  | { type: 'TICK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' };
