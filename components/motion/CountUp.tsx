import { useEffect, useState } from 'react';

import { AppText, type AppTextProps } from '@/components/ui';
import { useReduceMotion } from './Reveal';

export interface CountUpProps extends Omit<AppTextProps, 'children'> {
  value: number;
  /** Total run time in ms. Longer than ~1.2s stops feeling like a reward. */
  duration?: number;
  prefix?: string;
  suffix?: string;
}

/**
 * A number that ticks up to its value. Used on earned XP and streak counts,
 * where watching the number climb is a good part of the reward.
 *
 * Driven by a timer rather than Reanimated because the value has to be
 * formatted as text on every frame, which has to happen on the JS thread
 * anyway. The screen reader is given the final value immediately — nobody
 * wants to hear a number counted aloud.
 */
export function CountUp({
  value,
  duration = 900,
  prefix = '',
  suffix = '',
  ...textProps
}: CountUpProps) {
  const reduceMotion = useReduceMotion();
  const [run, setRun] = useState({ target: value, shown: 0 });

  // Restart during render rather than in an effect: adjusting state here is
  // the supported way to react to a changed prop, and it avoids the extra
  // frame of stale output an effect would leave behind.
  if (run.target !== value) {
    setRun({ target: value, shown: 0 });
  }

  useEffect(() => {
    if (value <= 0) return undefined;

    const startedAt = Date.now();
    const timer = setInterval(() => {
      const progress = Math.min(1, (Date.now() - startedAt) / duration);
      // Ease-out cubic: fast at first, settling into the final number.
      const eased = 1 - (1 - progress) ** 3;
      setRun({ target: value, shown: Math.round(value * eased) });
      if (progress >= 1) clearInterval(timer);
    }, 32);

    return () => clearInterval(timer);
  }, [value, duration]);

  // Reduced motion, and any non-positive value, resolve at render time — no
  // second state path to keep in sync.
  const shown = reduceMotion || value <= 0 ? value : run.shown;

  return (
    <AppText {...textProps} accessibilityLabel={`${prefix}${value}${suffix}`}>
      {prefix}
      {shown}
      {suffix}
    </AppText>
  );
}
