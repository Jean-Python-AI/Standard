import { db } from '@/db/clients';
import { allHabitLogs } from '@/db/schema';
import { useCallback, useEffect, useRef, useState } from 'react';
import { desc, eq } from 'drizzle-orm';

function getTodayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function subtractDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() - days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function computeStreak(): Promise<number> {
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
