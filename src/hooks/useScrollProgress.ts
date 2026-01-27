import { useState, useEffect, useCallback } from 'react';

export const useScrollProgress = (containerRef?: React.RefObject<HTMLElement>) => {
  const [progress, setProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const calculateProgress = useCallback(() => {
    const element = containerRef?.current || document.documentElement;
    const scrollTop = containerRef?.current 
      ? element.scrollTop 
      : window.scrollY;
    const scrollHeight = element.scrollHeight - element.clientHeight;
    
    if (scrollHeight > 0) {
      const newProgress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      setProgress(newProgress);
    }
  }, [containerRef]);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      setIsScrolling(true);
      calculateProgress();
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    const target = containerRef?.current || window;
    target.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial calculation
    calculateProgress();

    return () => {
      target.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [containerRef, calculateProgress]);

  return { progress, isScrolling };
};
