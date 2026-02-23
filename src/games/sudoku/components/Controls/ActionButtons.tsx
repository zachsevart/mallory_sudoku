import { useState, useCallback } from 'react';
import { useGame } from '../../hooks/useGame';
import styles from './Controls.module.css';

const LEGAL_FACTS = [
  "The Supreme Court building wasn't completed until 1935 — before that, the Court met in the Capitol basement.",
  "The longest Supreme Court case argument lasted 14 days (Georgia v. Brailsford, 1794).",
  "There's no constitutional requirement that Supreme Court justices be lawyers — or even have any legal training.",
  "The first female lawyer in the US, Arabella Mansfield, was admitted to the Iowa bar in 1869.",
  "The Constitution never mentions the word 'democracy' — not even once.",
  "Jury duty pay varies wildly: some states pay $5/day, while federal courts pay $50/day.",
  "The 'Miranda Rights' come from a 1966 case involving a man who confessed to kidnapping without knowing his rights.",
  "In medieval England, animals could be put on trial — pigs were once tried for murder.",
  "The shortest Supreme Court opinion ever was just 93 words (Dred Scott concurrence).",
  "The Constitution can technically be amended to say anything — there are no unamendable provisions.",
  "The first US law school (Litchfield Law School) was founded in 1773 in Connecticut.",
  "Lawyers weren't always required to pass bar exams — Abraham Lincoln was self-taught.",
  "The phrase 'beyond a reasonable doubt' doesn't appear anywhere in the Constitution.",
  "Federal judges have lifetime appointments, but they can still be impeached by Congress.",
  "The Bill of Rights originally only applied to the federal government, not the states.",
  "The youngest Supreme Court justice was Joseph Story, appointed at age 32 in 1812.",
  "Some states still have laws on the books making it illegal to sing off-key.",
  "The Supreme Court has its own private basketball court called 'the highest court in the land.'",
  "Plea bargaining resolves about 90-95% of all criminal cases in the US.",
  "The Constitution doesn't specify how many justices should be on the Supreme Court.",
];

export function ActionButtons() {
  const { state, dispatch } = useGame();
  const { isNotesMode, history, future } = state;
  const [showMalloryModal, setShowMalloryModal] = useState(false);
  const [currentFact, setCurrentFact] = useState('');

  const handleMalloryMode = useCallback(() => {
    const randomFact = LEGAL_FACTS[Math.floor(Math.random() * LEGAL_FACTS.length)];
    setCurrentFact(randomFact);
    setShowMalloryModal(true);
  }, []);

  return (
    <>
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

        <button
          className={`${styles.actionButton} ${styles.malloryButton}`}
          onClick={handleMalloryMode}
          aria-label="Mallory Mode"
          title="Get a legal fun fact!"
        >
          <svg viewBox="0 0 24 24" className={styles.icon}>
            <path
              fill="currentColor"
              d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"
            />
          </svg>
          <span>Mallory</span>
        </button>
      </div>

      {/* Mallory Mode Modal */}
      {showMalloryModal && (
        <div className={styles.malloryOverlay} onClick={() => setShowMalloryModal(false)}>
          <div className={styles.malloryModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.malloryHeader}>
              <span className={styles.malloryIcon}>⚖️</span>
              <h3>Legal Fun Fact</h3>
            </div>
            <p className={styles.malloryFact}>{currentFact}</p>
            <div className={styles.malloryActions}>
              <button
                className={styles.malloryBtn}
                onClick={handleMalloryMode}
              >
                Another Fact
              </button>
              <button
                className={styles.malloryBtnClose}
                onClick={() => setShowMalloryModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
