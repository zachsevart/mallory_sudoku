import type { CellValue } from '../../types/game';
import styles from './Board.module.css';

interface CellProps {
  value: CellValue;
  notes: Set<number>;
  isInitial: boolean;
  isSelected: boolean;
  isRelated: boolean;
  isSameValue: boolean;
  isError: boolean;
  row: number;
  col: number;
  onClick: () => void;
}

export function Cell({
  value,
  notes,
  isInitial,
  isSelected,
  isRelated,
  isSameValue,
  isError,
  row,
  col,
  onClick,
}: CellProps) {
  const classNames = [
    styles.cell,
    isInitial && styles.initial,
    isSelected && styles.selected,
    isRelated && !isSelected && styles.related,
    isSameValue && !isSelected && styles.sameValue,
    isError && styles.error,
    col % 3 === 2 && col !== 8 && styles.borderRight,
    row % 3 === 2 && row !== 8 && styles.borderBottom,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      onClick={onClick}
      aria-label={`Row ${row + 1}, Column ${col + 1}, ${value || 'empty'}`}
      data-row={row}
      data-col={col}
    >
      {value !== 0 ? (
        <span className={styles.value}>{value}</span>
      ) : notes.size > 0 ? (
        <div className={styles.notes}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <span key={n} className={styles.note}>
              {notes.has(n) ? n : ''}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  );
}
