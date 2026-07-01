import { useState, useCallback } from 'react';
import { db } from '@/db/clients';
import { habits } from '@/db/schema';
import { eq } from 'drizzle-orm';

export function getPrice(habitCount: number): number {
  return habitCount * 10;
}

export function useHabitActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (name: string, icon: string, color: string, colorId: number, price: number = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await db.insert(habits).values({ name, icon, color, colorId, price }).returning({ id: habits.id });
      return result.length > 0 ? result[0].id : false;
    } catch (e) {
      setError('Erreur lors de la création');
      console.error('Failed to create habit:', e);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const update = useCallback(async (id: number, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await db.update(habits).set({ name }).where(eq(habits.id, id));
      return true;
    } catch (e) {
      setError('Erreur lors de la mise à jour');
      console.error('Failed to update habit:', e);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: number): Promise<number> => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await db.select({ price: habits.price }).from(habits).where(eq(habits.id, id));
      const price = rows.length > 0 ? rows[0].price : 0;
      await db.delete(habits).where(eq(habits.id, id));
      return price;
    } catch (e) {
      setError('Erreur lors de la suppression');
      console.error('Failed to delete habit:', e);
      return 0;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { create, update, remove, isLoading, error };
}
