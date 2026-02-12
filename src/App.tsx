import { useState, useEffect, useCallback, useRef } from 'react';
import { Board } from './components/Board';
import { NumberPad, ActionButtons } from './components/Controls';
import { Timer, DifficultySelect } from './components/Header';
import { StatsModal } from './components/Stats';
import { WinModal } from './components/WinModal';
import { useGame } from './hooks/useGame';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { GameStats, Difficulty } from './types/game';
import styles from './App.module.css';

const initialStats: GameStats = {
  gamesPlayed: { easy: 0, medium: 0, hard: 0, expert: 0 },
  gamesCompleted: { easy: 0, medium: 0, hard: 0, expert: 0 },
  bestTimes: { easy: null, medium: null, hard: null, expert: null },
  currentStreak: 0,
  bestStreak: 0,
};

// Konami code sequence
const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

function GameContent() {
  const { state, dispatch, newGame } = useGame();
  const [stats, setStats] = useLocalStorage<GameStats>('sudoku-stats', initialStats);
  const [showStats, setShowStats] = useState(false);
  const [hasRecordedGame, setHasRecordedGame] = useState(false);

  // Easter egg states
  const [zenMode, setZenMode] = useState(false);
  const [rainbowMode, setRainbowMode] = useState(false);
  const [konamiUnlocked, setKonamiUnlocked] = useState(false);
  const [titleClicks, setTitleClicks] = useState(0);
  const [secretInput, setSecretInput] = useState('');
  const konamiIndex = useRef(0);
  const titleClickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Record game start
  useEffect(() => {
    if (!hasRecordedGame) {
      setStats((prev) => ({
        ...prev,
        gamesPlayed: {
          ...prev.gamesPlayed,
          [state.difficulty]: prev.gamesPlayed[state.difficulty] + 1,
        },
      }));
      setHasRecordedGame(true);
    }
  }, [state.difficulty, hasRecordedGame, setStats]);

  // Handle game completion
  useEffect(() => {
    if (state.isComplete && hasRecordedGame) {
      setStats((prev) => {
        const newStreak = prev.currentStreak + 1;
        const currentBest = prev.bestTimes[state.difficulty];
        const newBest =
          currentBest === null
            ? state.elapsedTime
            : Math.min(currentBest, state.elapsedTime);

        return {
          ...prev,
          gamesCompleted: {
            ...prev.gamesCompleted,
            [state.difficulty]: prev.gamesCompleted[state.difficulty] + 1,
          },
          bestTimes: {
            ...prev.bestTimes,
            [state.difficulty]: newBest,
          },
          currentStreak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
        };
      });
    }
  }, [state.isComplete, state.difficulty, state.elapsedTime, hasRecordedGame, setStats]);

  // Keyboard navigation + Easter eggs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Konami code
      if (e.key === KONAMI_CODE[konamiIndex.current]) {
        konamiIndex.current++;
        if (konamiIndex.current === KONAMI_CODE.length) {
          setKonamiUnlocked(true);
          setRainbowMode(true);
          konamiIndex.current = 0;
          // Auto-hide after 10 seconds
          setTimeout(() => setKonamiUnlocked(false), 10000);
        }
      } else {
        konamiIndex.current = 0;
      }

      // Secret word detection (rainbow)
      if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
        const newInput = (secretInput + e.key.toLowerCase()).slice(-7);
        setSecretInput(newInput);
        if (newInput === 'rainbow') {
          setRainbowMode(!rainbowMode);
          setSecretInput('');
        }
      }

      if (state.isComplete || showStats) return;

      const { selected } = state;

      // Arrow keys for navigation
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        if (!selected) {
          dispatch({ type: 'SELECT_CELL', position: [0, 0] });
          return;
        }

        const [row, col] = selected;
        let newRow = row;
        let newCol = col;

        switch (e.key) {
          case 'ArrowUp':
            newRow = Math.max(0, row - 1);
            break;
          case 'ArrowDown':
            newRow = Math.min(8, row + 1);
            break;
          case 'ArrowLeft':
            newCol = Math.max(0, col - 1);
            break;
          case 'ArrowRight':
            newCol = Math.min(8, col + 1);
            break;
        }

        if (newRow !== row || newCol !== col) {
          dispatch({ type: 'SELECT_CELL', position: [newRow, newCol] });
        }
      }

      // Number keys
      if (/^[1-9]$/.test(e.key)) {
        const num = parseInt(e.key, 10);
        if (state.isNotesMode) {
          dispatch({ type: 'TOGGLE_NOTE', value: num });
        } else {
          dispatch({ type: 'SET_VALUE', value: num as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 });
        }
      }

      // Delete/Backspace to clear
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        dispatch({ type: 'CLEAR_CELL' });
      }

      // N for notes toggle
      if (e.key === 'n' || e.key === 'N') {
        dispatch({ type: 'TOGGLE_NOTES_MODE' });
      }

      // Ctrl+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }

      // Ctrl+Y or Ctrl+Shift+Z for redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, dispatch, showStats, secretInput, rainbowMode]);

  // Apply theme classes
  useEffect(() => {
    document.body.classList.toggle('zen-mode', zenMode);
    document.body.classList.toggle('rainbow-mode', rainbowMode);
    return () => {
      document.body.classList.remove('zen-mode', 'rainbow-mode');
    };
  }, [zenMode, rainbowMode]);

  const handleNewGame = useCallback(
    (difficulty?: Difficulty) => {
      newGame(difficulty || state.difficulty);
      setHasRecordedGame(false);
    },
    [newGame, state.difficulty]
  );

  // Easter egg: Click title 7 times for Zen mode
  const handleTitleClick = () => {
    if (titleClickTimeout.current) {
      clearTimeout(titleClickTimeout.current);
    }

    const newClicks = titleClicks + 1;
    setTitleClicks(newClicks);

    if (newClicks >= 7) {
      setZenMode(!zenMode);
      setTitleClicks(0);
    } else {
      titleClickTimeout.current = setTimeout(() => setTitleClicks(0), 2000);
    }
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.titleContainer} onClick={handleTitleClick}>
          {/* Decorative flourishes */}
          <svg className={`${styles.titleDecor} ${styles.left}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 3c-1.5 3-3 4.5-6 6 3 1.5 4.5 3 6 6 1.5-3 3-4.5 6-6-3-1.5-4.5-3-6-6z" />
          </svg>
          <h1 className={styles.title}>Sudoku</h1>
          <svg className={`${styles.titleDecor} ${styles.right}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 3c-1.5 3-3 4.5-6 6 3 1.5 4.5 3 6 6 1.5-3 3-4.5 6-6-3-1.5-4.5-3-6-6z" />
          </svg>
        </div>
        <div className={styles.headerRow}>
          <Timer />
          <button
            className={styles.statsButton}
            onClick={() => setShowStats(true)}
            aria-label="View statistics"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="currentColor"
                d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
              />
            </svg>
          </button>
        </div>
        <DifficultySelect />
      </header>

      <main className={styles.main}>
        <Board />
        <div className={styles.controls}>
          <ActionButtons />
          <NumberPad />
        </div>
      </main>

      <footer className={styles.footer}>
        <p>
          Use <span className={styles.keyHint}>↑↓←→</span> to navigate,
          <span className={styles.keyHint}>1-9</span> to fill,
          <span className={styles.keyHint}>N</span> for notes
        </p>
      </footer>

      {/* Zen mode indicator */}
      {zenMode && (
        <div className={styles.zenIndicator}>
          <span className={styles.zenDot} />
          Zen Mode
        </div>
      )}

      {/* Konami code achievement */}
      {konamiUnlocked && (
        <div className={styles.achievementBadge}>
          🎮 Konami Code Unlocked!
        </div>
      )}

      <StatsModal
        stats={stats}
        isOpen={showStats}
        onClose={() => setShowStats(false)}
      />

      {state.isComplete && (
        <WinModal elapsedTime={state.elapsedTime} onNewGame={() => handleNewGame()} />
      )}
    </div>
  );
}

export default function App() {
  return <GameContent />;
}
