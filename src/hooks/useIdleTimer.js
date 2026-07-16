import { useEffect, useRef } from 'react';

/**
 * Calls onIdle after the specified timeout (default 60s)
 * whenever the user stops interacting (mousedown, touchstart, keydown).
 * 
 * @param {function} onIdle - Callback when idle timeout expires.
 * @param {number}   timeout - Idle time in milliseconds (default 60000).
 * @param {boolean}  enabled - Whether the timer is active (default true).
 */
export function useIdleTimer(onIdle, timeout = 60000, enabled = true) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      // Clear any running timer and stop listening
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

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
  }, [onIdle, timeout, enabled]);
}