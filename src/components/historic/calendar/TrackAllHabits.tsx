import TrackIcon from '@/assets/icons/track.svg';
import { BorderRadius, Colors, Fonts, IconSize, Spacing, Typography } from '@/constants';
import { useAllHabitLogs } from '@/hooks/useAllHabitLogs';
import { useStreak } from '@/hooks/useStreak';
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import CustomDay from './CustomDay';

function TrackAllHabits() {
  const now = useRef(new Date());
  const [year, setYear] = useState(now.current.getFullYear());
  const [month, setMonth] = useState(now.current.getMonth() + 1);

  const { markedDates } = useAllHabitLogs(year, month);
  const { streak } = useStreak();

  const onMonthChange = (date: { year: number; month: number }) => {
    setYear(date.year);
    setMonth(date.month);
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}>All Habits</Text>

        <View style={styles.streak}>
          <Text style={{color: Colors.Black, ...Typography.streakNumber}}>{streak}</Text>
          <TrackIcon color={Colors.Black} width={IconSize.xs} height={IconSize.xs} style={{marginTop: 2}}/>
        </View>
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
            todayTextColor: Colors.Black,
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
    paddingLeft: Spacing.xs,
    paddingVertical: Spacing.xxs
  },
  streak: {
    backgroundColor: Colors.primaryBackground,
    padding: 7,
    paddingLeft: 14,
    paddingRight:Spacing.xs,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs
  },
  title: {
    ...Typography.h2Medium,
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

export default React.memo(TrackAllHabits);
