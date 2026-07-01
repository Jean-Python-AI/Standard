import Check from '@/components/home/check';
import NoCheck from '@/components/home/noCheck';
import LoadingSpinner from '@/components/Loading/LoadingSpinner';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants';
import { useOverlay } from '@/contexts/OverlayContext';
import { useCheckers } from '@/hooks/useCheckers';
import { useTimeUntilMidnight } from '@/hooks/useTimeUntilMidnight';
import { useWallet } from '@/hooks/useWallet';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { db } from '@/db/clients';
import { allHabitLogs } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

type ListItem =
  | { type: 'divider'; key: string }
  | { type: 'checker'; key: string; id: number; label: string; color: string; checked: boolean; icon: string };

function getTodayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function subtractDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() - days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function computeStreak(): Promise<number> {
  const today = getTodayString();
  const rows = await db
    .select()
    .from(allHabitLogs)
    .where(eq(allHabitLogs.checked, true))
    .orderBy(desc(allHabitLogs.date));

  const checkedDates = new Set(rows.map(r => r.date));

  if (!checkedDates.has(today)) return 0;

  let count = 1;
  let current = today;

  while (true) {
    const prev = subtractDays(current, 1);
    if (checkedDates.has(prev)) {
      count++;
      current = prev;
    } else {
      break;
    }
  }

  return count;
}

export default function Index() {
  const { checkers, allChecked, toggle, refresh, isLoading } = useCheckers();
  const { open: openPopOver, setPendingNewHabit } = useOverlay();
  const { hoursLeft } = useTimeUntilMidnight();
  const { addCoins } = useWallet();
  const router = useRouter();
  const prevAllChecked = useRef(allChecked);
  const coinsAddedToday = useRef(false);

  useFocusEffect(
    useCallback(() => {
      refresh();
      coinsAddedToday.current = false;
    }, [refresh])
  );

  useEffect(() => {
    if (allChecked && !prevAllChecked.current) {
      openPopOver();

      if (!coinsAddedToday.current) {
        coinsAddedToday.current = true;
        computeStreak().then(streak => {
          if (streak > 0 && streak % 7 === 0) {
            addCoins(10);
          }
        });
      }
    }
    prevAllChecked.current = allChecked;
  }, [allChecked, openPopOver, addCoins]);

  const data = useMemo<ListItem[]>(() => {
    if (checkers.length === 0) {
      return [];
    }
    const unchecked = checkers.filter((c) => !c.checked);
    const checked = checkers.filter((c) => c.checked);
    const items: ListItem[] = unchecked.map((c) => ({
      type: 'checker',
      key: `${c.id}`,
      id: c.id,
      label: c.label,
      color: c.color,
      checked: c.checked,
      icon: c.icon,
    }));
    if (unchecked.length > 0 && checked.length > 0) {
      items.push({ type: 'divider', key: 'divider' });
    }
    checked.forEach((c) => {
      items.push({
        type: 'checker',
        key: `${c.id}`,
        id: c.id,
        label: c.label,
        color: c.color,
        checked: c.checked,
        icon: c.icon,
      });
    });
    return items;
  }, [checkers]);

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === 'divider') {
      return (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={{ width: '100%', alignItems: 'center', paddingVertical: Spacing.md }}>
          <View style={{ width: '80%', borderWidth: 1, borderColor: Colors.secondary, borderRadius: BorderRadius.sm }} />
        </Animated.View>
      );
    }
    return (
      <Animated.View layout={LinearTransition}>
        <Check
          label={item.label}
          color={item.color}
          checked={item.checked}
          icon={item.icon}
          onChange={() => toggle(item.id)}
        />
      </Animated.View>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleNewHabit = () => {
    setPendingNewHabit(true);
    router.push('/tabs/historic');
  };

  return (
    <View style={styles.container}>
      <View style={styles.todoSection}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Text style={styles.text}>Today</Text>
          <Text style={styles.subText}><Text style={{...Typography.streakNumber}}>{hoursLeft}</Text>h left</Text>
        </View>

        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.checkersContainer}
          ListEmptyComponent={<NoCheck onPress={handleNewHabit} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: Spacing.xl,
    backgroundColor: Colors.primaryBackground,
    gap: Spacing.md,
  },
  todoSection: {
    width: '100%',
    flexDirection: 'column',
    gap: Spacing.lg,
  },
  checkersContainer: {
    flexDirection: 'column',
    gap: Spacing.md,
    width: '100%',
    paddingHorizontal: Spacing.xs,
    paddingBottom: 300,
  },
  text: {
    ...Typography.h1,
    marginHorizontal: Spacing.md,
  },
  subText: {
    ...Typography.bodySmall,
    color: Colors.Black,
    marginHorizontal: Spacing.md,
  },
});
