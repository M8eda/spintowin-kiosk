import { useEffect, useRef } from 'react';

/**
 * Calls onIdle after the specified timeout (default 60s)
 * whenever the user stops interacting (mousedown, touchstart, keydown).
 */
export function useIdleTimer(onIdle, timeout = 60000) {
  const timerRef = useRef(null);

  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(onIdle, timeout);
    };

    const events = ['mousedown', 'touchstart', 'keydown'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer(); // start the initial timer

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [onIdle, timeout]);
}