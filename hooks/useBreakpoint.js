import { useState, useEffect } from 'react';

const BREAKPOINTS = {
  xs: 480,
  sm: 768,
  md: 1024,
  lg: 1280,
};

export function useBreakpoint() {
  const [state, setState] = useState({
    breakpoint: 'lg',
    width: 1024,
    scale: 1,
    isMobile: false,
    isTablet: false,
    isSmallScreen: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      let breakpoint;
      let scale;

      if (width < BREAKPOINTS.xs) {
        breakpoint = 'xs';
        scale = 0.5;
      } else if (width < BREAKPOINTS.sm) {
        breakpoint = 'sm';
        scale = 0.65;
      } else if (width < BREAKPOINTS.md) {
        breakpoint = 'md';
        scale = 0.85;
      } else {
        breakpoint = 'lg';
        scale = 1;
      }

      setState({
        breakpoint,
        width,
        scale,
        isMobile: width < BREAKPOINTS.sm,
        isTablet: width >= BREAKPOINTS.sm && width < BREAKPOINTS.md,
        isSmallScreen: width < 1200,
      });
    };

    // Initial call
    handleResize();

    // Add debounced resize listener
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return state;
}

export { BREAKPOINTS };
