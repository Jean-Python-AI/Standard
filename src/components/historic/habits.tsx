import { Colors, Spacing, Typography } from '@/constants';
import type { Habit } from '@/types/habit';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import BlockEditHabit from './editHabit';
import NoEditHabit from './noEditHabit';

type ProcessingState = { id: number; phase: 'loading' | 'exiting' } | null;

interface HabitsProps {
    habits: Habit[];
    onEditHabit: (id: number, label: string) => void;
    onNewHabitPress?: () => void;
    processingState?: ProcessingState;
}

function Habits({ habits, onEditHabit, onNewHabitPress, processingState }: HabitsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>modify</Text>
      {habits.length === 0 ? (
        <NoEditHabit onPress={onNewHabitPress} />
      ) : (
        habits.map(habit => (
          <Animated.View key={habit.id} layout={LinearTransition}>
            <BlockEditHabit id={habit.id} idColor={habit.colorId} label={habit.label} icon={habit.icon} onEdit={onEditHabit} processingState={processingState} />
          </Animated.View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    gap: Spacing.xs,
    padding: Spacing.xs,
    marginBottom: Spacing.md,
    paddingTop: 0,
  },
  text : {
    ...Typography.bodySmall,
    color: Colors.secondary,
  }
});

export default React.memo(Habits);
