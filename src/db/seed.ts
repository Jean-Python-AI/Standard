import { db } from '@/db/clients';
import { habits, habitLogs, allHabitLogs } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

function getDateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export async function seedLast6Days() {
  const allHabits = await db.select().from(habits);

  if (allHabits.length === 0) {
    console.log('[seed] Aucune habitude trouvée, rien à filler.');
    return;
  }

  for (let i = 1; i <= 6; i++) {
    const date = getDateString(i);

    for (const habit of allHabits) {
      const existing = await db.select().from(habitLogs).where(
        and(eq(habitLogs.habitId, habit.id), eq(habitLogs.date, date))
      );

      if (existing.length > 0) {
        await db.update(habitLogs)
          .set({ checked: true })
          .where(and(eq(habitLogs.habitId, habit.id), eq(habitLogs.date, date)));
      } else {
        await db.insert(habitLogs).values({
          habitId: habit.id,
          date,
          checked: true,
        });
      }
    }

    const existingAll = await db.select().from(allHabitLogs).where(
      eq(allHabitLogs.date, date)
    );

    if (existingAll.length > 0) {
      await db.update(allHabitLogs)
        .set({ checked: true })
        .where(eq(allHabitLogs.date, date));
    } else {
      await db.insert(allHabitLogs).values({ date, checked: true });
    }
  }

  console.log(`[seed] ${allHabits.length} habitude(s) cochées pour les 6 derniers jours.`);
}
