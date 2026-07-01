import { BorderRadius, Colors, Fonts, Spacing, Typography } from '@/constants';
import { useHabitLogs } from '@/hooks/useHabitLogs';
import type { ColorId } from '@/types/habit';
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import CustomDay from './CustomDay';

interface TrackHabitProps {
  id: number;
  name: string;
  colorId: ColorId;
  color: string;
}

function TrackHabit({ id, name, colorId, color }: TrackHabitProps) {
  const now = useRef(new Date());
  const [year, setYear] = useState(now.current.getFullYear());
  const [month, setMonth] = useState(now.current.getMonth() + 1);

  const { markedDates } = useHabitLogs(id, year, month, color);

  const onMonthChange = (date: { year: number; month: number }) => {
    setYear(date.year);
    setMonth(date.month);
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}>{name}</Text>
        <View style={[styles.colorDot, { backgroundColor: color }]} />
      </View>

      <View style={styles.graph}>
        <Calendar
          markingType="custom"
          markedDates={markedDates}
          onMonthChange={onMonthChange}
          dayComponent={CustomDay}
          enableSwipeMonths={false}
          hideExtraDays={false}
          firstDay={1}
          theme={{
            backgroundColor: Colors.tertiary,
            calendarBackground: Colors.tertiary,
            textSectionTitleColor: Colors.inactive,
            textSectionTitleDisabledColor: Colors.inactive,
            monthTextColor: Colors.Black,
            textMonthFontWeight: '700',
            textDayFontFamily: Fonts.medium,
            textMonthFontFamily: Fonts.bold,
            textDayHeaderFontFamily: Fonts.medium,
            textDayFontSize: Typography.caption.fontSize,
            textMonthFontSize: Typography.bodySmall.fontSize,
            textDayHeaderFontSize: Typography.captionSmall.fontSize,
            dayTextColor: Colors.inactive,
            arrowColor: Colors.Black,
            todayTextColor: color,
          }}
          style={styles.calendar}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 25,
    padding: Spacing.sm,
    backgroundColor: Colors.White,
    shadowColor: Colors.inactive,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    gap: Spacing.sm,
  },
  top: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs
  },
  title: {
    ...Typography.h2Medium,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.sm,
  },
  graph: {
    width: '100%',
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.tertiary,
    overflow: 'hidden',
  },
  calendar: {
    borderRadius: BorderRadius.md,
  },
});

export default React.memo(TrackHabit);
