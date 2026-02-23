import type { PuzzleDefinition } from '../types/pips';

// Region colors matching NYT Pips palette
const R = {
  rose:     '#e8c4c4',
  pink:     '#e8c0c8',
  sage:     '#c4d9c4',
  sky:      '#c4d4e8',
  sand:     '#e8dcc4',
  plum:     '#d4c4e0',
  peach:    '#e8d0c0',
  mint:     '#c0dcd4',
  lavender: '#d4c8e0',
  slate:    '#c8c8d4',
  olive:    '#d0d4b8',
  navy:     '#b8c0d4',
};

// ── Puzzle 1: Small irregular (from pips-nyt-game1.jpg) ─────────────
// Irregular shape ~5x4, constraints: 6, 5, =, 0
const puzzle1: PuzzleDefinition = {
  id: 'nyt-001',
  gridSize: { rows: 5, cols: 4 },
  inactiveCells: [
    [0, 0], [0, 1], [0, 3],
    [4, 0], [4, 3],
  ],
  regions: [
    {
      id: 'r1',
      cells: [[0, 2], [1, 2]],
      constraint: { type: 'sum', target: 6 },
      color: R.plum,
    },
    {
      id: 'r2',
      cells: [[1, 0], [1, 1], [2, 0], [2, 1]],
      constraint: { type: 'sum', target: 5 },
      color: R.pink,
    },
    {
      id: 'r3',
      cells: [[2, 2], [2, 3], [3, 2]],
      constraint: { type: 'equals' },
      color: R.mint,
    },
    {
      id: 'r4',
      cells: [[3, 0], [3, 1], [4, 1], [4, 2]],
      constraint: { type: 'sum', target: 0 },
      color: R.peach,
    },
    {
      id: 'r5',
      cells: [[1, 3], [3, 3]],
      constraint: { type: 'none' },
      color: R.sand,
    },
  ],
  dominoes: [
    { values: [6, 2] },
    { values: [4, 4] },
    { values: [5, 1] },
    { values: [0, 0] },
    { values: [6, 5] },
    { values: [6, 6] },
  ],
};

// ── Puzzle 2: E-shape (from 0x044.webp) ─────────────────────────────
// 5x6 E-shape, constraints: >1, >2, =, =, =, 12, 3, 1, 2, 5
const puzzle2: PuzzleDefinition = {
  id: 'nyt-002',
  gridSize: { rows: 5, cols: 6 },
  inactiveCells: [
    [2, 0], [2, 1],
    [2, 4], [2, 5],
    [3, 0], [3, 1],
    [3, 4], [3, 5],
  ],
  regions: [
    {
      id: 'r1',
      cells: [[0, 0], [0, 1]],
      constraint: { type: 'greater-than', target: 1 },
      color: R.plum,
    },
    {
      id: 'r2',
      cells: [[0, 2], [0, 3], [0, 4], [0, 5]],
      constraint: { type: 'greater-than', target: 2 },
      color: R.pink,
    },
    {
      id: 'r3',
      cells: [[1, 0], [1, 1], [1, 2]],
      constraint: { type: 'equals' },
      color: R.rose,
    },
    {
      id: 'r4',
      cells: [[1, 3], [1, 4], [1, 5]],
      constraint: { type: 'equals' },
      color: R.mint,
    },
    {
      id: 'r5',
      cells: [[2, 2], [2, 3]],
      constraint: { type: 'equals' },
      color: R.slate,
    },
    {
      id: 'r6',
      cells: [[4, 0], [4, 1]],
      constraint: { type: 'sum', target: 12 },
      color: R.olive,
    },
    {
      id: 'r7',
      cells: [[4, 2]],
      constraint: { type: 'sum', target: 3 },
      color: R.plum,
    },
    {
      id: 'r8',
      cells: [[3, 2], [3, 3]],
      constraint: { type: 'sum', target: 1 },
      color: R.pink,
    },
    {
      id: 'r9',
      cells: [[4, 3], [4, 4]],
      constraint: { type: 'sum', target: 2 },
      color: R.mint,
    },
    {
      id: 'r10',
      cells: [[4, 5]],
      constraint: { type: 'sum', target: 5 },
      color: R.peach,
    },
  ],
  dominoes: [
    { values: [4, 3] },
    { values: [5, 4] },
    { values: [6, 5] },
    { values: [3, 3] },
    { values: [4, 4] },
    { values: [6, 6] },
    { values: [5, 2] },
    { values: [3, 1] },
    { values: [0, 1] },
    { values: [5, 3] },
  ],
};

// ── Puzzle 3: Pyramid (from solution-9-21-hard.jpg — HARD) ──────────
// Large pyramid on 7x6 grid. Solution is known from the image.
// Row 0:       [4,4]
// Row 1:    [3,5,1,6]
// Row 2:  [3,1,4,2,6,5]
// Row 3:  [6,5,6,3,6,5]
// Row 4:    [2,0,4,1]
// Row 5:      [0,0]
const puzzle3: PuzzleDefinition = {
  id: 'nyt-003-hard',
  gridSize: { rows: 7, cols: 6 },
  inactiveCells: [
    [0, 0], [0, 1], [0, 4], [0, 5],
    [1, 0], [1, 5],
    [4, 0], [4, 5],
    [5, 0], [5, 1], [5, 4], [5, 5],
    [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  ],
  regions: [
    {
      id: 'r1',
      cells: [[0, 2], [0, 3]],
      constraint: { type: 'equals' },
      color: R.lavender,
    },
    {
      id: 'r2',
      cells: [[1, 1], [1, 2], [2, 0], [2, 1]],
      constraint: { type: 'sum', target: 3 },
      color: R.pink,
    },
    {
      id: 'r3',
      cells: [[1, 3], [1, 4], [2, 4], [2, 5]],
      constraint: { type: 'sum', target: 5 },
      color: R.mint,
    },
    {
      id: 'r4',
      cells: [[2, 2], [2, 3], [3, 2]],
      constraint: { type: 'sum', target: 1 },
      color: R.peach,
    },
    {
      id: 'r5',
      cells: [[3, 0]],
      constraint: { type: 'sum', target: 3 },
      color: R.olive,
    },
    {
      id: 'r6',
      cells: [[3, 1], [4, 1]],
      constraint: { type: 'less-than', target: 4 },
      color: R.plum,
    },
    {
      id: 'r7',
      cells: [[3, 3], [3, 4], [4, 3], [4, 4]],
      constraint: { type: 'not-equals' },
      color: R.pink,
    },
    {
      id: 'r8',
      cells: [[3, 5], [4, 4]],
      constraint: { type: 'sum', target: 18 },
      color: R.navy,
    },
    {
      id: 'r9',
      cells: [[4, 1], [4, 2]],
      constraint: { type: 'greater-than', target: 4 },
      color: R.peach,
    },
    {
      id: 'r10',
      cells: [[4, 2], [4, 3]],
      constraint: { type: 'sum', target: 2 },
      color: R.olive,
    },
    {
      id: 'r11',
      cells: [[5, 2], [5, 3]],
      constraint: { type: 'sum', target: 0 },
      color: R.olive,
    },
  ],
  dominoes: [
    { values: [4, 4] },
    { values: [3, 5] },
    { values: [1, 6] },
    { values: [3, 1] },
    { values: [4, 2] },
    { values: [6, 5] },
    { values: [6, 5] },
    { values: [6, 3] },
    { values: [6, 5] },
    { values: [2, 0] },
    { values: [4, 1] },
    { values: [0, 0] },
  ],
};

// ── Puzzle 4: C-shape (from 01pips-tips-downpage1-articleLarge.webp) ─
// C-shaped board, all = constraints
const puzzle4: PuzzleDefinition = {
  id: 'nyt-004',
  gridSize: { rows: 6, cols: 5 },
  inactiveCells: [
    [0, 0],
    [2, 4],
    [3, 0], [3, 1],
    [4, 0], [4, 1], [4, 4],
    [5, 4],
  ],
  regions: [
    {
      id: 'r1',
      cells: [[0, 1], [0, 2], [0, 3], [1, 1], [1, 2]],
      constraint: { type: 'equals' },
      color: R.plum,
    },
    {
      id: 'r2',
      cells: [[0, 4], [1, 3], [1, 4]],
      constraint: { type: 'equals' },
      color: R.sand,
    },
    {
      id: 'r3',
      cells: [[2, 0], [2, 1], [2, 2], [2, 3], [3, 2]],
      constraint: { type: 'equals' },
      color: R.pink,
    },
    {
      id: 'r4',
      cells: [[3, 3], [3, 4], [4, 3]],
      constraint: { type: 'equals' },
      color: R.mint,
    },
    {
      id: 'r5',
      cells: [[4, 2], [5, 0], [5, 1], [5, 2], [5, 3]],
      constraint: { type: 'equals' },
      color: R.peach,
    },
  ],
  dominoes: [
    { values: [5, 5] },
    { values: [4, 2] },
    { values: [6, 6] },
    { values: [4, 2] },
    { values: [5, 5] },
    { values: [4, 4] },
    { values: [3, 3] },
    { values: [6, 3] },
  ],
};

// ── Puzzle 5: Cross with ≠ (from pips-game-play-question-v0) ────────
// Cross/plus shape, constraints: ≠, 5, 5
const puzzle5: PuzzleDefinition = {
  id: 'nyt-005',
  gridSize: { rows: 6, cols: 4 },
  inactiveCells: [
    [0, 0], [0, 2], [0, 3],
    [1, 0], [1, 3],
    [4, 0],
    [5, 0], [5, 3],
  ],
  regions: [
    {
      id: 'r1',
      cells: [[0, 1], [1, 1], [2, 0], [2, 1]],
      constraint: { type: 'equals' },
      color: R.lavender,
    },
    {
      id: 'r2',
      cells: [[1, 2], [2, 2], [2, 3], [3, 2], [3, 3]],
      constraint: { type: 'not-equals' },
      color: R.pink,
    },
    {
      id: 'r3',
      cells: [[3, 0], [3, 1], [4, 1]],
      constraint: { type: 'sum', target: 5 },
      color: R.mint,
    },
    {
      id: 'r4',
      cells: [[4, 2], [4, 3], [5, 1], [5, 2]],
      constraint: { type: 'sum', target: 5 },
      color: R.pink,
    },
  ],
  dominoes: [
    { values: [6, 6] },
    { values: [5, 4] },
    { values: [6, 1] },
    { values: [2, 1] },
    { values: [3, 2] },
  ],
};

// ── Puzzle 6: Irregular (from 0x022.webp) ───────────────────────────
// ~6x6 irregular shape, constraints: 4, =, =, =, 8, >4
const puzzle6: PuzzleDefinition = {
  id: 'nyt-006',
  gridSize: { rows: 6, cols: 6 },
  inactiveCells: [
    [0, 0], [0, 1],
    [0, 5],
    [3, 0],
    [4, 0], [4, 4], [4, 5],
    [5, 0], [5, 4], [5, 5],
  ],
  regions: [
    {
      id: 'r1',
      cells: [[0, 2], [0, 3], [1, 2], [1, 3]],
      constraint: { type: 'sum', target: 4 },
      color: R.pink,
    },
    {
      id: 'r2',
      cells: [[0, 4], [1, 4], [1, 5]],
      constraint: { type: 'equals' },
      color: R.mint,
    },
    {
      id: 'r3',
      cells: [[1, 0], [1, 1], [2, 0], [2, 1]],
      constraint: { type: 'equals' },
      color: R.plum,
    },
    {
      id: 'r4',
      cells: [[2, 2], [2, 3], [3, 2], [3, 3]],
      constraint: { type: 'equals' },
      color: R.sand,
    },
    {
      id: 'r5',
      cells: [[2, 4], [2, 5], [3, 4], [3, 5]],
      constraint: { type: 'equals' },
      color: R.slate,
    },
    {
      id: 'r6',
      cells: [[3, 1], [4, 1], [4, 2], [4, 3]],
      constraint: { type: 'sum', target: 8 },
      color: R.olive,
    },
    {
      id: 'r7',
      cells: [[5, 1], [5, 2], [5, 3]],
      constraint: { type: 'greater-than', target: 4 },
      color: R.plum,
    },
  ],
  dominoes: [
    { values: [3, 1] },
    { values: [4, 4] },
    { values: [2, 2] },
    { values: [5, 5] },
    { values: [3, 3] },
    { values: [6, 2] },
    { values: [1, 1] },
    { values: [5, 6] },
    { values: [4, 0] },
    { values: [6, 5] },
  ],
};

// ── Puzzle 7: Wide board (from nytimes-pips-puzzle-game-7.png) ──────
// Irregular trapezoid, constraints: 3, <2, 0, 30
const puzzle7: PuzzleDefinition = {
  id: 'nyt-007',
  gridSize: { rows: 3, cols: 6 },
  inactiveCells: [
    [0, 0],
    [2, 5],
  ],
  regions: [
    {
      id: 'r1',
      cells: [[0, 1], [0, 2]],
      constraint: { type: 'sum', target: 3 },
      color: R.plum,
    },
    {
      id: 'r2',
      cells: [[0, 3], [0, 4], [0, 5]],
      constraint: { type: 'sum', target: 0 },
      color: R.mint,
    },
    {
      id: 'r3',
      cells: [[1, 0], [1, 1], [2, 0], [2, 1]],
      constraint: { type: 'less-than', target: 2 },
      color: R.peach,
    },
    {
      id: 'r4',
      cells: [[1, 2], [1, 3], [1, 4], [1, 5], [2, 2], [2, 3], [2, 4]],
      constraint: { type: 'sum', target: 30 },
      color: R.pink,
    },
  ],
  dominoes: [
    { values: [4, 5] },
    { values: [6, 4] },
    { values: [0, 1] },
    { values: [5, 6] },
    { values: [4, 6] },
    { values: [1, 0] },
    { values: [3, 4] },
    { values: [5, 5] },
  ],
};

export const EASY_PUZZLES: PuzzleDefinition[] = [puzzle1, puzzle5, puzzle7];
export const MEDIUM_PUZZLES: PuzzleDefinition[] = [puzzle4, puzzle6, puzzle2];
export const HARD_PUZZLES: PuzzleDefinition[] = [puzzle3];

export const ALL_PUZZLES: PuzzleDefinition[] = [
  ...EASY_PUZZLES,
  ...MEDIUM_PUZZLES,
  ...HARD_PUZZLES,
];

export function getRandomPuzzle(): PuzzleDefinition {
  const index = Math.floor(Math.random() * ALL_PUZZLES.length);
  return ALL_PUZZLES[index];
}
