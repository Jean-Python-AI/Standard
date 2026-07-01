import { Colors, Opacity, Typography } from '@/constants';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { DayProps } from 'react-native-calendars/src/calendar/day';

const INACTIVE_COLOR = Colors.White;

type CustomDayProps = DayProps & { date?: { dateString: string; day: number; month: number; year: number } };

function CustomDay({ state, marking, children }: CustomDayProps) {
  const bgColor = (marking?.customStyles?.container?.backgroundColor as string) ?? INACTIVE_COLOR;
  const isInactive = state === 'inactive';
  const isMarked = !!marking?.customStyles?.container?.backgroundColor;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bgColor },
        isInactive && styles.inactive,
      ]}
    >
      <Text style={[styles.text, {color: isMarked ? Colors.White : Colors.inactive}]}>
        {String(children)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactive: {
    opacity: Opacity.inactive,
  },
  text: {
    ...Typography.caption,
  },
});

export default React.memo(CustomDay);
