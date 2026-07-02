import { db } from '@/db/clients';
import { allHabitLogs } from '@/db/schema';
import { getTodayString, subtractDays } from '@/utils/dateUtils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { desc, eq } from 'drizzle-orm';

export async function computeStreak(): Promise<number> {
  const today = getTodayString();
  const rows = await db
    .select()
    .from(allHabitLogs)
    .where(eq(allHabitLogs.checked, true))
    .orderBy(desc(allHabitLogs.date));

  const checkedDates = new Set(rows.map(r => r.date));

  if (!checkedDates.has(today)) return 0;

  let count = 1;
  let current = today;

  while (true) {
    const prev = subtractDays(current, 1);
    if (checkedDates.has(prev)) {
      count++;
      current = prev;
    } else {
      break;
    }
  }

  return count;
}

export function useStreak(): { streak: number; isLoading: boolean; refresh: () => Promise<void> } {
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const requestIdRef = useRef(0);

  const refresh = useCallback(async () => {
    const currentId = ++requestIdRef.current;
    try {
      const result = await computeStreak();
      if (currentId === requestIdRef.current) {
        setStreak(result);
      }
    } catch (e) {
      console.error('Failed to compute streak:', e);
      if (currentId === requestIdRef.current) {
        setStreak(0);
      }
    } finally {
      if (currentId === requestIdRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { streak, isLoading, refresh };
}
