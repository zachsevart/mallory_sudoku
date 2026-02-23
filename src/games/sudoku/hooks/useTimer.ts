import { useEffect, useCallback } from 'react';
import { useGame } from './useGame';

export function useTimer() {
  const { state, dispatch } = useGame();
  const { isPaused, isComplete, elapsedTime } = state;

  useEffect(() => {
    if (isPaused || isComplete) return;

    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isComplete, dispatch]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        dispatch({ type: 'PAUSE' });
      } else {
        dispatch({ type: 'RESUME' });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch]);

  const pause = useCallback(() => {
    dispatch({ type: 'PAUSE' });
  }, [dispatch]);

  const resume = useCallback(() => {
    dispatch({ type: 'RESUME' });
  }, [dispatch]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    isPaused,
    isComplete,
    pause,
    resume,
  };
}
