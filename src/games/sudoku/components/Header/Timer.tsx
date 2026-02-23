import { useTimer } from '../../hooks/useTimer';
import styles from './Header.module.css';

export function Timer() {
  const { formattedTime, isPaused, pause, resume } = useTimer();

  return (
    <div className={styles.timer}>
      <button
        className={styles.timerButton}
        onClick={isPaused ? resume : pause}
        aria-label={isPaused ? 'Resume timer' : 'Pause timer'}
      >
        {isPaused ? (
          <svg viewBox="0 0 24 24" className={styles.timerIcon}>
            <path fill="currentColor" d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className={styles.timerIcon}>
            <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        )}
      </button>
      <span className={styles.time}>{formattedTime}</span>
    </div>
  );
}
