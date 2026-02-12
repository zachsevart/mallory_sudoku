import { useGame } from '../../hooks/useGame';
import styles from './Controls.module.css';

export function ActionButtons() {
  const { state, dispatch } = useGame();
  const { isNotesMode, history, future } = state;

  return (
    <div className={styles.actions}>
      <button
        className={styles.actionButton}
        onClick={() => dispatch({ type: 'UNDO' })}
        disabled={history.length === 0}
        aria-label="Undo"
        title="Undo (Ctrl+Z)"
      >
        <svg viewBox="0 0 24 24" className={styles.icon}>
          <path
            fill="currentColor"
            d="M12.5 8c-2.65 0-5.05 1-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"
          />
        </svg>
        <span>Undo</span>
      </button>

      <button
        className={styles.actionButton}
        onClick={() => dispatch({ type: 'REDO' })}
        disabled={future.length === 0}
        aria-label="Redo"
        title="Redo (Ctrl+Y)"
      >
        <svg viewBox="0 0 24 24" className={styles.icon}>
          <path
            fill="currentColor"
            d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"
          />
        </svg>
        <span>Redo</span>
      </button>

      <button
        className={styles.actionButton}
        onClick={() => dispatch({ type: 'CLEAR_CELL' })}
        aria-label="Clear cell"
        title="Clear (Delete/Backspace)"
      >
        <svg viewBox="0 0 24 24" className={styles.icon}>
          <path
            fill="currentColor"
            d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"
          />
        </svg>
        <span>Clear</span>
      </button>

      <button
        className={`${styles.actionButton} ${isNotesMode ? styles.active : ''}`}
        onClick={() => dispatch({ type: 'TOGGLE_NOTES_MODE' })}
        aria-label={`Notes mode ${isNotesMode ? 'on' : 'off'}`}
        aria-pressed={isNotesMode}
        title="Notes (N)"
      >
        <svg viewBox="0 0 24 24" className={styles.icon}>
          <path
            fill="currentColor"
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
          />
        </svg>
        <span>Notes</span>
      </button>
    </div>
  );
}
