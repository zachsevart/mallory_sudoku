import { PipsProvider } from '../../games/pips/context/PipsContext';
import { Pips } from '../../games/pips/Pips';
import { getRandomPuzzle } from '../../games/pips/data/puzzles';

const initialPuzzle = getRandomPuzzle();

export function PipsGame() {
  return (
    <PipsProvider initialPuzzle={initialPuzzle}>
      <Pips />
    </PipsProvider>
  );
}
