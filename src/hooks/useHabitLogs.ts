import { useCallback, useEffect, useRef, useState } from 'react';
import { db } from '@/db/clients';
import { habitLogs } from '@/db/schema';
import { eq, and, gte, lt } from 'drizzle-orm';
type MarkedDates = {
  [key: string]: {
    customStyles?: {
      container?: {
        backgroundColor?: string;
      };
    };
  };
};

export function useHabitLogs(habitId: number, year: number, month: number, color: string) {
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const buildMarkedDates = useCallback((rows: { date: string; checked: boolean }[]) => {
    const marked: MarkedDates = {};
    for (const row of rows) {
      if (row.checked) {
        marked[row.date] = {
          customStyles: {
            container: {
              backgroundColor: color,
            },
          },
        };
      }
    }
    return marked;
  }, [color]);

  const fetchLogs = useCallback(() => {
    const currentId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    const monthStr = String(month).padStart(2, '0');
    const startDate = `${year}-${monthStr}-01`;

    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const nextMonthStr = String(nextMonth).padStart(2, '0');
    const endDate = `${nextYear}-${nextMonthStr}-01`;

    db.select()
      .from(habitLogs)
      .where(
        and(
          eq(habitLogs.habitId, habitId),
          gte(habitLogs.date, startDate),
          lt(habitLogs.date, endDate),
        ),
      )
      .then(rows => {
        if (currentId !== requestIdRef.current) return;
        setMarkedDates(buildMarkedDates(rows));
      })
      .catch(e => {
        if (currentId !== requestIdRef.current) return;
        setError('Erreur de chargement des logs');
        console.error('Failed to fetch habit logs:', e);
      })
      .finally(() => {
        if (currentId === requestIdRef.current) setIsLoading(false);
      });
  }, [habitId, year, month, buildMarkedDates]);

  useEffect(() => {
    let cancelled = false;
    const currentId = ++requestIdRef.current;

    const monthStr = String(month).padStart(2, '0');
    const startDate = `${year}-${monthStr}-01`;

    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const nextMonthStr = String(nextMonth).padStart(2, '0');
    const endDate = `${nextYear}-${nextMonthStr}-01`;

    db.select()
      .from(habitLogs)
      .where(
        and(
          eq(habitLogs.habitId, habitId),
          gte(habitLogs.date, startDate),
          lt(habitLogs.date, endDate),
        ),
      )
      .then(rows => {
        if (cancelled || currentId !== requestIdRef.current) return;
        setMarkedDates(buildMarkedDates(rows));
      })
      .catch(e => {
        if (cancelled || currentId !== requestIdRef.current) return;
        setError('Erreur de chargement des logs');
        console.error('Failed to fetch habit logs:', e);
      })
      .finally(() => {
        if (!cancelled && currentId === requestIdRef.current) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [habitId, year, month, buildMarkedDates]);

  return { markedDates, refresh: fetchLogs, isLoading, error };
}
