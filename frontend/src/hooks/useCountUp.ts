import { useState, useEffect, useRef } from 'react';

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  easing?: 'linear' | 'easeOut' | 'easeInOut';
  delay?: number;
}

export const useCountUp = ({ 
  start = 0, 
  end, 
  duration = 1000, 
  easing = 'easeOut',
  delay = 0 
}: UseCountUpOptions) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const easingFunctions = {
    linear: (t: number) => t,
    easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
    easeInOut: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  };

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFunctions[easing](progress);
      const currentCount = Math.round(start + (end - start) * easedProgress);

      setCount(currentCount);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    const timeoutId = setTimeout(() => {
      setIsAnimating(true);
      startTimeRef.current = undefined;
      frameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, start, duration, delay, easing]);

  return { count, isAnimating };
};
