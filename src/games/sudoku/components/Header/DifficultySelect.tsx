import { useGame } from '../../hooks/useGame';
import type { Difficulty } from '../../types/game';
import { DIFFICULTY_CONFIG } from '../../utils/difficulty';
import styles from './Header.module.css';

const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

export function DifficultySelect() {
  const { state, newGame } = useGame();

  const handleNewGame = (difficulty: Difficulty) => {
    if (
      state.isComplete ||
      window.confirm('Start a new game? Current progress will be lost.')
    ) {
      newGame(difficulty);
    }
  };

  return (
    <div className={styles.difficultySelect}>
      <span className={styles.label}>New Game:</span>
      <div className={styles.buttons}>
        {difficulties.map((diff) => (
          <button
            key={diff}
            className={`${styles.difficultyButton} ${state.difficulty === diff ? styles.active : ''}`}
            onClick={() => handleNewGame(diff)}
          >
            {DIFFICULTY_CONFIG[diff].label}
          </button>
        ))}
      </div>
    </div>
  );
}
