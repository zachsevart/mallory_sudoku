import { useEffect } from 'react';
import type { GameStats, Difficulty } from '../../types/game';
import { DIFFICULTY_CONFIG } from '../../utils/difficulty';
import styles from './Stats.module.css';

interface StatsModalProps {
  stats: GameStats;
  isOpen: boolean;
  onClose: () => void;
}

const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

function formatTime(seconds: number | null): string {
  if (seconds === null) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function StatsModal({ stats, isOpen, onClose }: StatsModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalPlayed = Object.values(stats.gamesPlayed).reduce((a, b) => a + b, 0);
  const totalCompleted = Object.values(stats.gamesCompleted).reduce((a, b) => a + b, 0);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Statistics</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="currentColor"
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
          </button>
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>{totalPlayed}</span>
            <span className={styles.summaryLabel}>Played</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>{totalCompleted}</span>
            <span className={styles.summaryLabel}>Completed</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>{stats.currentStreak}</span>
            <span className={styles.summaryLabel}>Streak</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>{stats.bestStreak}</span>
            <span className={styles.summaryLabel}>Best Streak</span>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Difficulty</th>
              <th>Played</th>
              <th>Won</th>
              <th>Best Time</th>
            </tr>
          </thead>
          <tbody>
            {difficulties.map((diff) => (
              <tr key={diff}>
                <td>{DIFFICULTY_CONFIG[diff].label}</td>
                <td>{stats.gamesPlayed[diff]}</td>
                <td>{stats.gamesCompleted[diff]}</td>
                <td>{formatTime(stats.bestTimes[diff])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
