import { useEffect, useState } from 'react';

const ONE_MINUTE = 60_000;

/**
 * The current time, as state rather than a `new Date()` call in the render
 * body. Reading the clock during render is impure — the React Compiler is free
 * to reuse a memoised result, which is how you get a "Good morning" that is
 * still there at 9pm. Refreshing on an interval also means a screen left open
 * across midnight rolls over on its own.
 */
export function useNow(intervalMs: number = ONE_MINUTE): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}
