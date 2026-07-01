import { useCallback, useEffect, useRef, useState } from 'react';
import { db } from '@/db/clients';
import { habits, habitLogs, allHabitLogs } from '@/db/schema';
import { and, eq, gte, lt } from 'drizzle-orm';

type MarkedDates = {
  [key: string]: {
    customStyles?: {
      container?: {
        backgroundColor?: string;
      };
    };
  };
};

const ALL_DONE_COLOR = '#000000';

export async function syncAllHabitLog(date: string) {
  const allHabits = await db.select().from(habits);
  const logs = await db.select().from(habitLogs).where(eq(habitLogs.date, date));

  const checkedCount = logs.filter(r => r.checked).length;
  const allChecked = allHabits.length > 0 && checkedCount === allHabits.length;

  const existing = await db.select().from(allHabitLogs).where(eq(allHabitLogs.date, date));

  if (existing.length > 0) {
    await db.update(allHabitLogs).set({ checked: allChecked }).where(eq(allHabitLogs.date, date));
  } else {
    await db.insert(allHabitLogs).values({ date, checked: allChecked });
  }
}

export function useAllHabitLogs(year: number, month: number) {
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
              backgroundColor: ALL_DONE_COLOR,
            },
          },
        };
      }
    }
    return marked;
  }, []);

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
      .from(allHabitLogs)
      .where(and(gte(allHabitLogs.date, startDate), lt(allHabitLogs.date, endDate)))
      .then(rows => {
        if (currentId !== requestIdRef.current) return;
        setMarkedDates(buildMarkedDates(rows));
      })
      .catch(e => {
        if (currentId !== requestIdRef.current) return;
        setError('Erreur de chargement des logs');
        console.error('Failed to fetch all habit logs:', e);
      })
      .finally(() => {
        if (currentId === requestIdRef.current) setIsLoading(false);
      });
  }, [year, month, buildMarkedDates]);

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
      .from(allHabitLogs)
      .where(and(gte(allHabitLogs.date, startDate), lt(allHabitLogs.date, endDate)))
      .then(rows => {
        if (cancelled || currentId !== requestIdRef.current) return;
        setMarkedDates(buildMarkedDates(rows));
      })
      .catch(e => {
        if (cancelled || currentId !== requestIdRef.current) return;
        setError('Erreur de chargement des logs');
        console.error('Failed to fetch all habit logs:', e);
      })
      .finally(() => {
        if (!cancelled && currentId === requestIdRef.current) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [year, month, buildMarkedDates]);

  return { markedDates, refresh: fetchLogs, isLoading, error };
}
