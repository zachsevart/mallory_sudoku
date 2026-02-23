import type { Board, CellValue } from '../types/game';

export function isValidPlacement(
  board: Board,
  row: number,
  col: number,
  value: CellValue
): boolean {
  if (value === 0) return true;

  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === value) return false;
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === value) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (r !== row && c !== col && board[r][c] === value) return false;
    }
  }

  return true;
}

export function findErrors(board: Board): boolean[][] {
  const errors: boolean[][] = Array.from({ length: 9 }, () =>
    Array(9).fill(false)
  );

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = board[row][col];
      if (value !== 0 && !isValidPlacement(board, row, col, value)) {
        errors[row][col] = true;
      }
    }
  }

  return errors;
}

export function isBoardComplete(board: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) return false;
      if (!isValidPlacement(board, row, col, board[row][col])) return false;
    }
  }
  return true;
}

export function isBoardSolved(board: Board, solution: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== solution[row][col]) return false;
    }
  }
  return true;
}
