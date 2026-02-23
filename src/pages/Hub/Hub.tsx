import { Link } from 'react-router-dom';
import styles from './Hub.module.css';

export function Hub() {
  return (
    <div className={styles.hub}>
      <header className={styles.header}>
        <div className={styles.titleContainer}>
          <svg className={`${styles.titleDecor} ${styles.left}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 3c-1.5 3-3 4.5-6 6 3 1.5 4.5 3 6 6 1.5-3 3-4.5 6-6-3-1.5-4.5-3-6-6z" />
          </svg>
          <h1 className={styles.title}>Mallot</h1>
          <svg className={`${styles.titleDecor} ${styles.right}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 3c-1.5 3-3 4.5-6 6 3 1.5 4.5 3 6 6 1.5-3 3-4.5 6-6-3-1.5-4.5-3-6-6z" />
          </svg>
        </div>
        <p className={styles.subtitle}>Game and Goof Hub</p>
      </header>

      <main className={styles.main}>
        <div className={styles.gamesGrid}>
          <Link to="/sudoku" className={styles.card} style={{ '--card-accent': 'var(--accent)' } as React.CSSProperties}>
            <div className={styles.cardIcon}>
              <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="6" y="6" width="52" height="52" rx="2" />
                <line x1="23.3" y1="6" x2="23.3" y2="58" strokeWidth="2" />
                <line x1="40.7" y1="6" x2="40.7" y2="58" strokeWidth="2" />
                <line x1="6" y1="23.3" x2="58" y2="23.3" strokeWidth="2" />
                <line x1="6" y1="40.7" x2="58" y2="40.7" strokeWidth="2" />
              </svg>
            </div>
            <h2 className={styles.cardTitle}>Sudoku</h2>
            <p className={styles.cardDesc}>Classic 9x9 number puzzle with four difficulty levels</p>
            <span className={styles.playLabel}>Play →</span>
          </Link>

          <Link to="/pips" className={styles.card} style={{ '--card-accent': 'var(--zen-green)' } as React.CSSProperties}>
            <div className={styles.cardIcon}>
              <svg viewBox="0 0 64 64" fill="currentColor">
                <rect x="6" y="6" width="24" height="52" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <rect x="34" y="6" width="24" height="52" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="18" cy="18" r="3.5" />
                <circle cx="18" cy="32" r="3.5" />
                <circle cx="18" cy="46" r="3.5" />
                <circle cx="46" cy="22" r="3.5" />
                <circle cx="46" cy="42" r="3.5" />
              </svg>
            </div>
            <h2 className={styles.cardTitle}>Pips</h2>
            <p className={styles.cardDesc}>Place dominoes to match the pattern, but it hella doesnt work yet</p>
            <span className={styles.playLabel}>Play →</span>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Mallory Game Hub</p>
      </footer>
    </div>
  );
}
