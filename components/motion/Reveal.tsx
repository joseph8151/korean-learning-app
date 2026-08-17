import type { ReactNode } from 'react';
import { AccessibilityInfo } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useEffect, useState } from 'react';

export interface RevealProps {
  children: ReactNode;
  /** Position in a list. Each step delays the entrance by ~55ms. */
  index?: number;
  /** Extra delay before the stagger starts. */
  delay?: number;
}

/**
 * Staggered entrance for a stack of cards. The small cascade is most of the
 * difference between a screen that appears and a screen that arrives.
 *
 * Respects "reduce motion": travel is dropped in favour of a plain fade, so
 * the content still resolves without sliding around the screen.
 */
export function Reveal({ children, index = 0, delay = 0 }: RevealProps) {
  const reduceMotion = useReduceMotion();
  const total = delay + index * 55;

  // FadeInDown already carries the upward travel; overriding its initial
  // values on top of that fights the preset for no visible gain.
  const entering = reduceMotion
    ? FadeIn.duration(180).delay(total)
    : FadeInDown.springify().damping(16).stiffness(150).delay(total);

  return <Animated.View entering={entering}>{children}</Animated.View>;
}

/** Tracks the OS "reduce motion" setting, including changes while running. */
export function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    let cancelled = false;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (!cancelled) setReduce(enabled);
      })
      .catch(() => undefined);

    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);

    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);

  return reduce;
}
