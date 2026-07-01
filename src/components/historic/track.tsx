import { Spacing } from '@/constants';
import type { Habit } from '@/types/habit';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import TrackAllHabits from './calendar/TrackAllHabits';
import TrackHabit from './calendar/trackHabit';

interface HabitTrackProps {
  habits: Habit[];
}

function HabitTrack({ habits }: HabitTrackProps) {
  return (
    <View style={styles.container}>
      <TrackAllHabits />
      {habits.map((habit) => (
        <TrackHabit key={habit.id} id={habit.id} name={habit.label} colorId={habit.colorId} color={habit.color} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: Spacing.xs,
    gap: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
});

export default React.memo(HabitTrack);
