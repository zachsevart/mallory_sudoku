import type { PipsState, Region, PipValue, Position } from '../types/pips';

export function getCellValue(state: PipsState, pos: Position): PipValue | null {
  const [row, col] = pos;
  const cell = state.board[row]?.[col];
  if (!cell || cell.inactive) return null;
  if (!cell.dominoId) return null;

  const domino = state.dominoes.find(d => d.id === cell.dominoId);
  if (!domino) return null;

  const placement = state.placed.get(cell.dominoId);
  if (!placement) return null;

  return cell.half === 'first' ? domino.values[0] : domino.values[1];
}

export function isRegionSatisfied(region: Region, state: PipsState): boolean {
  const values: PipValue[] = [];

  for (const pos of region.cells) {
    const val = getCellValue(state, pos);
    if (val === null) return true; // incomplete — not yet violated
    values.push(val);
  }

  const { type, target } = region.constraint;

  switch (type) {
    case 'equals':
      return values.every(v => v === values[0]);

    case 'not-equals':
      return new Set(values).size === values.length;

    case 'sum':
      return values.reduce<number>((a, b) => a + b, 0) === target!;

    case 'greater-than':
      return values.every(v => v > target!);

    case 'less-than':
      return values.every(v => v < target!);

    case 'none':
      return true;

    default:
      return true;
  }
}

export function findViolations(state: PipsState): Set<string> {
  const violations = new Set<string>();
  for (const region of state.puzzle.regions) {
    const allFilled = region.cells.every(pos => getCellValue(state, pos) !== null);
    if (allFilled && !isRegionSatisfied(region, state)) {
      violations.add(region.id);
    }
  }
  return violations;
}

export function isPuzzleSolved(state: PipsState): boolean {
  // All dominoes must be placed
  if (state.placed.size !== state.dominoes.length) return false;

  // All regions must be satisfied
  for (const region of state.puzzle.regions) {
    if (!isRegionSatisfied(region, state)) return false;
  }

  return true;
}

export function canPlaceDomino(
  state: PipsState,
  position: Position,
  orientation: 'horizontal' | 'vertical',
  excludeDominoId?: string
): boolean {
  const [row, col] = position;
  const { rows, cols } = state.puzzle.gridSize;

  if (row < 0 || row >= rows || col < 0 || col >= cols) return false;

  const [row2, col2]: Position = orientation === 'horizontal'
    ? [row, col + 1]
    : [row + 1, col];

  if (row2 >= rows || col2 >= cols) return false;

  const cell1 = state.board[row][col];
  const cell2 = state.board[row2][col2];

  if (cell1.inactive || cell2.inactive) return false;

  const free1 = !cell1.dominoId || cell1.dominoId === excludeDominoId;
  const free2 = !cell2.dominoId || cell2.dominoId === excludeDominoId;

  return free1 && free2;
}
