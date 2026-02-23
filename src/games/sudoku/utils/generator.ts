import type { Board, CellValue, Difficulty } from '../types/game';
import { hasUniqueSolution } from './solver';
import { getClueCount } from './difficulty';

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function generateCompleteBoard(): Board {
  const board: Board = Array.from({ length: 9 }, () =>
    Array(9).fill(0) as CellValue[]
  );

  function fillBoard(row: number, col: number): boolean {
    if (col === 9) {
      row++;
      col = 0;
    }
    if (row === 9) return true;

    const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const num of numbers) {
      if (isValidPlacement(board, row, col, num)) {
        board[row][col] = num as CellValue;
        if (fillBoard(row, col + 1)) return true;
        board[row][col] = 0;
      }
    }

    return false;
  }

  function isValidPlacement(
    board: Board,
    row: number,
    col: number,
    num: number
  ): boolean {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (board[row][c] === num) return false;
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (board[r][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (board[r][c] === num) return false;
      }
    }

    return true;
  }

  fillBoard(0, 0);
  return board;
}

function removeCells(board: Board, clueCount: number): Board {
  const puzzle = board.map((row) => [...row]) as Board;
  const positions: [number, number][] = [];

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }

  const shuffledPositions = shuffle(positions);
  let cellsToRemove = 81 - clueCount;
  let index = 0;

  while (cellsToRemove > 0 && index < shuffledPositions.length) {
    const [row, col] = shuffledPositions[index];
    const backup = puzzle[row][col];

    if (backup !== 0) {
      puzzle[row][col] = 0;

      if (hasUniqueSolution(puzzle)) {
        cellsToRemove--;
      } else {
        puzzle[row][col] = backup;
      }
    }

    index++;
  }

  return puzzle;
}

export interface GeneratedPuzzle {
  puzzle: Board;
  solution: Board;
}

export function generatePuzzle(difficulty: Difficulty): GeneratedPuzzle {
  const solution = generateCompleteBoard();
  const clueCount = getClueCount(difficulty);
  const puzzle = removeCells(solution, clueCount);

  return { puzzle, solution };
}

export function createEmptyBoard(): Board {
  return Array.from({ length: 9 }, () => Array(9).fill(0) as CellValue[]);
}

export function createEmptyNotes(): Set<number>[][] {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => new Set<number>())
  );
}

export function createInitialMask(puzzle: Board): boolean[][] {
  return puzzle.map((row) => row.map((cell) => cell !== 0));
}
