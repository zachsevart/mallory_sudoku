import { useGame } from '../../hooks/useGame';
import type { CellValue } from '../../types/game';
import styles from './Controls.module.css';

export function NumberPad() {
  const { state, dispatch } = useGame();
  const { isNotesMode, board } = state;

  const getNumberCount = (num: number): number => {
    let count = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === num) count++;
      }
    }
    return count;
  };

  const handleNumberClick = (num: number) => {
    if (isNotesMode) {
      dispatch({ type: 'TOGGLE_NOTE', value: num });
    } else {
      dispatch({ type: 'SET_VALUE', value: num as CellValue });
    }
  };

  return (
    <div className={styles.numberPad}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
        const count = getNumberCount(num);
        const isComplete = count >= 9;

        return (
          <button
            key={num}
            className={`${styles.numberButton} ${isComplete ? styles.complete : ''}`}
            onClick={() => handleNumberClick(num)}
            disabled={isComplete && !isNotesMode}
            aria-label={`${num}${isComplete ? ' (complete)' : ''}`}
          >
            <span className={styles.number}>{num}</span>
            {!isComplete && (
              <span className={styles.count}>{9 - count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
