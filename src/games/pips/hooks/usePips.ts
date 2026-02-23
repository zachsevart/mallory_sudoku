import { useContext } from 'react';
import { PipsContext } from '../context/PipsContext';

export function usePips() {
  const context = useContext(PipsContext);
  if (!context) {
    throw new Error('usePips must be used within a PipsProvider');
  }
  return context;
}
