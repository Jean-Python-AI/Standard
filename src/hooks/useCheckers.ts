import { ColorsHabits } from '@/constants/Colors';
import { db } from '@/db/clients';
import { habits, habitLogs } from '@/db/schema';
import { getTodayString } from '@/utils/dateUtils';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { eq, and } from 'drizzle-orm';
import type { Checker } from '@/types/habit';
import { syncAllHabitLog } from './useAllHabitLogs';

export function useCheckers() {
  const [checkers, setCheckers] = useState<Checker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const refresh = useCallback(async () => {
    const currentId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const rows = await db.select().from(habits);
      if (currentId !== requestIdRef.current) return;

      const today = getTodayString();
      const logs = await db.select().from(habitLogs).where(eq(habitLogs.date, today));
      if (currentId !== requestIdRef.current) return;

      const checkedMap = new Map<number, boolean>();
      for (const log of logs) {
        checkedMap.set(log.habitId, log.checked);
      }

      setCheckers(rows.map(r => ({
        id: r.id,
        label: r.name,
        color: ColorsHabits[r.colorId] ?? ColorsHabits[0],
        checked: checkedMap.get(r.id) ?? false,
        icon: r.icon,
      })));
    } catch (e) {
      if (currentId !== requestIdRef.current) return;
      setError('Erreur de chargement');
      console.error('Failed to fetch habits:', e);
    } finally {
      if (currentId === requestIdRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const currentId = ++requestIdRef.current;

    (async () => {
      try {
        const rows = await db.select().from(habits);
        if (cancelled || currentId !== requestIdRef.current) return;

        const today = getTodayString();
        const logs = await db.select().from(habitLogs).where(eq(habitLogs.date, today));
        if (cancelled || currentId !== requestIdRef.current) return;

        const checkedMap = new Map<number, boolean>();
        for (const log of logs) {
          checkedMap.set(log.habitId, log.checked);
        }

        setCheckers(rows.map(r => ({
          id: r.id,
          label: r.name,
          color: ColorsHabits[r.colorId] ?? ColorsHabits[0],
          checked: checkedMap.get(r.id) ?? false,
          icon: r.icon,
        })));
      } catch (e) {
        if (cancelled || currentId !== requestIdRef.current) return;
        setError('Erreur de chargement');
        console.error('Failed to fetch habits:', e);
      } finally {
        if (!cancelled && currentId === requestIdRef.current) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const checkedCount = useMemo(
    () => checkers.filter(c => c.checked).length,
    [checkers],
  );

  const allChecked = checkers.length > 0 && checkedCount === checkers.length;

  const toggle = useCallback(async (id: number) => {
    const today = getTodayString();
    const checker = checkers.find(c => c.id === id);
    const newChecked = checker ? !checker.checked : true;

    setCheckers(prev =>
      prev.map(c => (c.id === id ? { ...c, checked: newChecked } : c)),
    );

    try {
      const existing = await db.select().from(habitLogs).where(
        and(eq(habitLogs.habitId, id), eq(habitLogs.date, today)),
      );

      if (existing.length > 0) {
        await db.update(habitLogs)
          .set({ checked: newChecked })
          .where(and(eq(habitLogs.habitId, id), eq(habitLogs.date, today)));
      } else {
        await db.insert(habitLogs).values({
          habitId: id,
          date: today,
          checked: newChecked,
        });
      }

      await syncAllHabitLog(today);
    } catch (e) {
      console.error('Failed to persist habit log:', e);
      setCheckers(prev =>
        prev.map(c => (c.id === id ? { ...c, checked: !newChecked } : c)),
      );
    }
  }, [checkers]);

  return { checkers, checkedCount, allChecked, toggle, refresh, isLoading, error };
}
