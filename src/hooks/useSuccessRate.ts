import { useCallback, useEffect, useRef, useState } from 'react';
import { db } from '@/db/clients';
import { allHabitLogs } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

function daysBetween(a: string, b: string): number {
  const d1 = new Date(a);
  const d2 = new Date(b);
  const diff = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function useSuccessRate() {
  const [rate, setRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const requestIdRef = useRef(0);

  const fetch = useCallback(() => {
    const currentId = ++requestIdRef.current;
    setIsLoading(true);

    db.select()
      .from(allHabitLogs)
      .where(eq(allHabitLogs.checked, true))
      .orderBy(asc(allHabitLogs.date))
      .then(rows => {
        if (currentId !== requestIdRef.current) return;

        if (rows.length === 0) {
          setRate(null);
        } else {
          const firstDate = rows[0].date;
          const today = toDateString(new Date());
          const totalDays = daysBetween(firstDate, today);
          setRate(Math.round((rows.length / totalDays) * 100));
        }
      })
      .catch(e => {
        if (currentId !== requestIdRef.current) return;
        console.error('Failed to fetch success rate:', e);
        setRate(null);
      })
      .finally(() => {
        if (currentId === requestIdRef.current) setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const currentId = ++requestIdRef.current;

    db.select()
      .from(allHabitLogs)
      .where(eq(allHabitLogs.checked, true))
      .orderBy(asc(allHabitLogs.date))
      .then(rows => {
        if (cancelled || currentId !== requestIdRef.current) return;

        if (rows.length === 0) {
          setRate(null);
        } else {
          const firstDate = rows[0].date;
          const today = toDateString(new Date());
          const totalDays = daysBetween(firstDate, today);
          setRate(Math.round((rows.length / totalDays) * 100));
        }
      })
      .catch(e => {
        if (cancelled || currentId !== requestIdRef.current) return;
        console.error('Failed to fetch success rate:', e);
        setRate(null);
      })
      .finally(() => {
        if (!cancelled && currentId === requestIdRef.current) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { rate, refresh: fetch, isLoading };
}
