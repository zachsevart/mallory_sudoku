import { useEffect, useMemo } from 'react';
import { useGame } from '../../hooks/useGame';
import { DIFFICULTY_CONFIG } from '../../utils/difficulty';
import styles from './WinModal.module.css';

interface WinModalProps {
  elapsedTime: number;
  onNewGame: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const CONFETTI_COLORS = ['#c9a227', '#e6c84a', '#8b4513', '#4c6f52', '#a63d2f', '#ff6b6b', '#48dbfb'];

export function WinModal({ elapsedTime, onNewGame }: WinModalProps) {
  const { state } = useGame();
  const isSpeedDemon = elapsedTime < 120; // Under 2 minutes

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const confettiPieces = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${2 + Math.random() * 2}s`,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * 360,
      size: 6 + Math.random() * 8,
    }));
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Confetti */}
        <div className={styles.confetti}>
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className={styles.confettiPiece}
              style={{
                left: piece.left,
                animationDelay: piece.delay,
                animationDuration: piece.duration,
                backgroundColor: piece.color,
                width: piece.size,
                height: piece.size,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                transform: `rotate(${piece.rotation}deg)`,
              }}
            />
          ))}
        </div>

        <div className={styles.celebration}>
          <span className={styles.trophy}>🏆</span>
          <span className={styles.sparkle} />
          <span className={styles.sparkle} />
          <span className={styles.sparkle} />
          <span className={styles.sparkle} />
        </div>

        <h2 className={styles.title}>Puzzle Complete!</h2>
        <p className={styles.subtitle}>
          You solved the {DIFFICULTY_CONFIG[state.difficulty].label.toLowerCase()} puzzle
        </p>

        <div className={styles.time}>
          {isSpeedDemon && <span className={styles.speedDemon}>Speed Demon!</span>}
          <span className={styles.timeLabel}>Your Time</span>
          <span className={styles.timeValue}>{formatTime(elapsedTime)}</span>
        </div>

        <button className={styles.button} onClick={onNewGame}>
          Play Again
        </button>
      </div>
    </div>
  );
}
