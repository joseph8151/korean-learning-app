import { useCallback, useEffect, useRef } from 'react';

/** Measures how long a learner actually spends inside a lesson. */
export function useStudyTimer() {
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const elapsedSeconds = useCallback(() => {
    if (startedAt.current === null) return 1;
    return Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
  }, []);

  const reset = useCallback(() => {
    startedAt.current = Date.now();
  }, []);

  return { elapsedSeconds, reset };
}
