import { Routes, Route, Navigate } from 'react-router-dom';
import { Hub } from './pages/Hub';
import { SudokuGame } from './pages/SudokuGame';
import { PipsGame } from './pages/PipsGame';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Hub />} />
      <Route path="/sudoku" element={<SudokuGame />} />
      <Route path="/pips" element={<PipsGame />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
