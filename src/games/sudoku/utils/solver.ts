import type { Board, CellValue } from '../types/game';

function isValid(board: Board, row: number, col: number, num: number): boolean {
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

function findEmpty(board: Board): [number, number] | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) return [row, col];
    }
  }
  return null;
}

export function solve(board: Board): Board | null {
  const copy = board.map((row) => [...row]) as Board;
  if (solveInPlace(copy)) {
    return copy;
  }
  return null;
}

function solveInPlace(board: Board): boolean {
  const empty = findEmpty(board);
  if (!empty) return true;

  const [row, col] = empty;

  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num as CellValue;
      if (solveInPlace(board)) return true;
      board[row][col] = 0;
    }
  }

  return false;
}

export function countSolutions(board: Board, limit = 2): number {
  const copy = board.map((row) => [...row]) as Board;
  let count = 0;

  function backtrack(): boolean {
    if (count >= limit) return true;

    const empty = findEmpty(copy);
    if (!empty) {
      count++;
      return count >= limit;
    }

    const [row, col] = empty;

    for (let num = 1; num <= 9; num++) {
      if (isValid(copy, row, col, num)) {
        copy[row][col] = num as CellValue;
        if (backtrack()) return true;
        copy[row][col] = 0;
      }
    }

    return false;
  }

  backtrack();
  return count;
}

export function hasUniqueSolution(board: Board): boolean {
  return countSolutions(board, 2) === 1;
}
