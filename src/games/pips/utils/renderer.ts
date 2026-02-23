import type { Constraint } from '../types/pips';

// Standard domino pip layout positions in a 3x3 grid (indices 0-8)
const PIP_POSITIONS: Record<number, number[]> = {
  0: [],
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

export function getPipPositions(value: number): number[] {
  return PIP_POSITIONS[value] ?? [];
}

export function getConstraintLabel(constraint: Constraint): string {
  switch (constraint.type) {
    case 'equals':       return '=';
    case 'not-equals':   return '≠';
    case 'sum':          return `${constraint.target}`;
    case 'greater-than': return `>${constraint.target}`;
    case 'less-than':    return `<${constraint.target}`;
    case 'none':         return '';
    default:             return '';
  }
}
