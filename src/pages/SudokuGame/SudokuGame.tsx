import { GameProvider } from '../../games/sudoku/context/GameContext';
import { Sudoku } from '../../games/sudoku/Sudoku';

export function SudokuGame() {
  return (
    <GameProvider>
      <Sudoku />
    </GameProvider>
  );
}
