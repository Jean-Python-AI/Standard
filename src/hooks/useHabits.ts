import type { Habit, ColorId } from '@/types/habit';
import { db } from '@/db/clients';
import { habits } from '@/db/schema';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useHabits() {
  const [data, setData] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const refresh = useCallback(() => {
    const currentId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    db.select().from(habits)
      .then(rows => {
        if (currentId !== requestIdRef.current) return;
        setData(rows.map(r => ({
          id: r.id,
          label: r.name,
          colorId: r.colorId as ColorId,
          color: r.color,
          icon: r.icon,
          price: r.price,
        })));
      })
      .catch(e => {
        if (currentId !== requestIdRef.current) return;
        setError('Erreur de chargement');
        console.error('Failed to fetch habits:', e);
      })
      .finally(() => {
        if (currentId === requestIdRef.current) setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const currentId = ++requestIdRef.current;

    db.select().from(habits)
      .then(rows => {
        if (cancelled || currentId !== requestIdRef.current) return;
        setData(rows.map(r => ({
          id: r.id,
          label: r.name,
          colorId: r.colorId as ColorId,
          color: r.color,
          icon: r.icon,
          price: r.price,
        })));
      })
      .catch(e => {
        if (cancelled || currentId !== requestIdRef.current) return;
        setError('Erreur de chargement');
        console.error('Failed to fetch habits:', e);
      })
      .finally(() => {
        if (!cancelled && currentId === requestIdRef.current) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { habits: data, refresh, isLoading, error };
}
