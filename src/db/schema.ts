import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';

// Habits table
export const habits = sqliteTable('habits', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  icon: text('icon').notNull().default('idea'),
  color: text('color').notNull().default('#FF3B30'),
  colorId: integer('color_id').notNull().default(0),
  price: integer('price').notNull().default(10),
});

// Tracking per habit
export const habitLogs = sqliteTable('habit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  habitId: integer('habit_id')
    .notNull()
    .references(() => habits.id, { onDelete: 'cascade' }),

  date: text('date').notNull(),

  checked: integer('checked', { mode: 'boolean' }).notNull().default(false),
}, (table) => [
  unique('habit_date').on(table.habitId, table.date),
]);

// Tracking for all the habits
export const allHabitLogs = sqliteTable('all_habit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  date: text('date').notNull().unique(),

  checked: integer('checked', { mode: 'boolean' }).notNull().default(false),
});

export type Habit = typeof habits.$inferSelect;
export type NewHabit = typeof habits.$inferInsert;
export type HabitLog = typeof habitLogs.$inferSelect;
export type NewHabitLog = typeof habitLogs.$inferInsert;
export type AllHabitLog = typeof allHabitLogs.$inferSelect;
export type NewAllHabitLog = typeof allHabitLogs.$inferInsert;