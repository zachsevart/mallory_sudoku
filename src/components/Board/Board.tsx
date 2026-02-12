import { Cell } from './Cell';
import { useGame } from '../../hooks/useGame';
import styles from './Board.module.css';

export function Board() {
  const { state, dispatch } = useGame();
  const { board, notes, initial, selected, errors } = state;

  const getIsRelated = (row: number, col: number): boolean => {
    if (!selected) return false;
    const [selRow, selCol] = selected;
    const sameRow = row === selRow;
    const sameCol = col === selCol;
    const sameBox =
      Math.floor(row / 3) === Math.floor(selRow / 3) &&
      Math.floor(col / 3) === Math.floor(selCol / 3);
    return sameRow || sameCol || sameBox;
  };

  const getIsSameValue = (row: number, col: number): boolean => {
    if (!selected) return false;
    const [selRow, selCol] = selected;
    const selectedValue = board[selRow][selCol];
    return selectedValue !== 0 && board[row][col] === selectedValue;
  };

  const handleCellClick = (row: number, col: number) => {
    dispatch({ type: 'SELECT_CELL', position: [row, col] });
  };

  return (
    <div className={styles.board} role="grid" aria-label="Sudoku board">
      {board.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={value}
            notes={notes[rowIndex][colIndex]}
            isInitial={initial[rowIndex][colIndex]}
            isSelected={
              selected !== null &&
              selected[0] === rowIndex &&
              selected[1] === colIndex
            }
            isRelated={getIsRelated(rowIndex, colIndex)}
            isSameValue={getIsSameValue(rowIndex, colIndex)}
            isError={errors[rowIndex][colIndex]}
            row={rowIndex}
            col={colIndex}
            onClick={() => handleCellClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}
