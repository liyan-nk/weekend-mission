import { useState, useEffect } from 'react';

export interface WeekendStatus {
  isWeekend: boolean;
  weekendKey: string;
  countdownMs: number; // Ms until next Saturday 12:00 AM (if weekday)
  currentTime: Date;
  isSimulated: boolean;
}

/**
 * Calculates the weekend key (e.g. "2026-W30") for a given date.
 * Both Saturday and Sunday of the same weekend map to the Saturday of that weekend.
 */
export function getWeekendKey(date: Date): string {
  const day = date.getDay();
  const saturday = new Date(date);
  
  if (day === 0) { // Sunday
    saturday.setDate(date.getDate() - 1);
  } else if (day === 6) { // Saturday
    // Already Saturday
  } else {
    // Weekday: find the upcoming Saturday
    const daysUntilSaturday = 6 - day;
    saturday.setDate(date.getDate() + daysUntilSaturday);
  }
  
  // Compute ISO Week Number for the Saturday of this weekend
  const target = new Date(saturday.valueOf());
  const dayNr = (saturday.getDay() + 6) % 7; // Monday is 0, Sunday is 6
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  const weekNum = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  const year = saturday.getFullYear();
  return `${year}-W${String(weekNum).padStart(2, '0')}`;
}

/**
 * Hook to retrieve and tick the weekend status, countdown, and simulated time features.
 */
export function useWeekendStatus(): WeekendStatus {
  const [status, setStatus] = useState<WeekendStatus>(() => calculateStatus());

  function calculateStatus(): WeekendStatus {
    let now = new Date();
    let isSimulated = false;

    // Developer override in local development
    if (import.meta.env.DEV) {
      const simTimeStr = localStorage.getItem('WM_DEBUG_SIMULATED_TIME');
      if (simTimeStr) {
        const parsed = new Date(simTimeStr);
        if (!isNaN(parsed.getTime())) {
          now = parsed;
          isSimulated = true;
        }
      }
      
      const forceWeekend = localStorage.getItem('WM_DEBUG_FORCE_WEEKEND');
      if (forceWeekend === 'true') {
        return {
          isWeekend: true,
          weekendKey: getWeekendKey(now),
          countdownMs: 0,
          currentTime: now,
          isSimulated: true
        };
      }
    }

    const day = now.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    const isWeekend = day === 6 || day === 0;

    // Calculate weekend key
    const weekendKey = getWeekendKey(now);

    // Calculate countdown
    let countdownMs = 0;
    if (!isWeekend) {
      // Find next Saturday 12:00:00 AM
      const nextSat = new Date(now);
      const daysUntilSaturday = 6 - day;
      nextSat.setDate(now.getDate() + daysUntilSaturday);
      nextSat.setHours(0, 0, 0, 0);
      countdownMs = Math.max(0, nextSat.getTime() - now.getTime());
    }

    return {
      isWeekend,
      weekendKey,
      countdownMs,
      currentTime: now,
      isSimulated
    };
  }

  useEffect(() => {
    // Tick every second to keep the countdown live
    const interval = setInterval(() => {
      setStatus(calculateStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return status;
}
