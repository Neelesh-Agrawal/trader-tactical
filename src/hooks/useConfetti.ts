import { useCallback } from 'react';

type ConfettiIntensity = 'low' | 'medium' | 'high';

interface UseConfettiOptions {
  colors?: string[];
}

// Use dynamic import to avoid bundling issues with canvas-confetti
const loadConfetti = () => import('canvas-confetti').then(m => m.default);

export const useConfetti = (options: UseConfettiOptions = {}) => {
  const {
    colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']
  } = options;

  const fire = useCallback(async (intensity: ConfettiIntensity = 'medium') => {
    const duration = intensity === 'high' ? 3000 : intensity === 'medium' ? 2000 : 1000;
    const particleCount = intensity === 'high' ? 150 : intensity === 'medium' ? 100 : 50;
    
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const confetti = await loadConfetti();

    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
      colors,
    };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = duration;
      const particleMultiplier = timeLeft / duration;

      confetti({
        ...defaults,
        particleCount: Math.floor(particleCount * particleMultiplier),
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount: Math.floor(particleCount * particleMultiplier),
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    setTimeout(() => clearInterval(interval), duration);
  }, [colors]);

  const fireBurst = useCallback(async (x = 0.5, y = 0.5) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const confetti = await loadConfetti();

    confetti({
      particleCount: 100,
      startVelocity: 55,
      spread: 70,
      origin: { x, y },
      colors,
      zIndex: 9999,
    });
  }, [colors]);

  const fireFromElement = useCallback(async (element: HTMLElement) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const confetti = await loadConfetti();

    const rect = element.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 50,
      startVelocity: 25,
      spread: 55,
      origin: { x, y },
      colors,
      zIndex: 9999,
    });
  }, [colors]);

  return { fire, fireBurst, fireFromElement };
};
