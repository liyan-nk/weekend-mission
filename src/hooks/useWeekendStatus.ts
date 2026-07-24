import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface WeekendStatus {
  isWeekend: boolean;
  weekendKey: string;
  countdownMs: number; // Ms until next Saturday 12:00 AM (if weekday)
  currentTime: Date;
  isSimulated: boolean;
  overrideState: 'automatic' | 'force-open' | 'force-closed';
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
 * Hook to retrieve and tick the weekend status, countdown, and simulated overrides.
 */
export function useWeekendStatus(): WeekendStatus {
  const [overrideState, setOverrideState] = useState<'automatic' | 'force-open' | 'force-closed'>('automatic');
  const [status, setStatus] = useState<WeekendStatus>(() => calculateStatus('automatic'));

  // 1. Periodically fetch the override state from DB or Local Mock settings
  useEffect(() => {
    const fetchOverride = async () => {
      if (isSupabaseConfigured()) {
        try {
          const { data } = await supabase
            .from('weekend_settings')
            .select('value')
            .eq('key', 'weekend_override')
            .maybeSingle();
          if (data && (data.value === 'automatic' || data.value === 'force-open' || data.value === 'force-closed')) {
            setOverrideState(data.value as any);
          }
        } catch (e) {
          console.warn('Failed to load weekend override settings:', e);
        }
      } else {
        const val = localStorage.getItem('WM_MOCK_WEEKEND_STATUS');
        if (val === 'automatic' || val === 'force-open' || val === 'force-closed') {
          setOverrideState(val as any);
        }
      }
    };

    fetchOverride();
    const interval = setInterval(fetchOverride, 10000); // refresh override settings every 10s
    return () => clearInterval(interval);
  }, []);

  function calculateStatus(currOverride: typeof overrideState): WeekendStatus {
    let now = new Date();
    let isSimulated = false;

    // Developer force weekend checkbox (stored locally)
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
          isSimulated: true,
          overrideState: currOverride
        };
      }
    }

    // Determine weekend state based on global overrides or calendar
    let isWeekend = false;
    if (currOverride === 'force-open') {
      isWeekend = true;
    } else if (currOverride === 'force-closed') {
      isWeekend = false;
    } else {
      const day = now.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
      isWeekend = day === 6 || day === 0;
    }

    const weekendKey = getWeekendKey(now);

    // Calculate countdown until next Saturday
    let countdownMs = 0;
    if (!isWeekend) {
      const day = now.getDay();
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
      isSimulated,
      overrideState: currOverride
    };
  }

  // 2. Tick local timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(calculateStatus(overrideState));
    }, 1000);

    return () => clearInterval(interval);
  }, [overrideState]);

  return status;
}
