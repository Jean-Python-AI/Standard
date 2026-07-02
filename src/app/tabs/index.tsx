import Check from '@/components/home/check';
import NoCheck from '@/components/home/noCheck';
import LoadingSpinner from '@/components/Loading/LoadingSpinner';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants';
import { useOverlay } from '@/contexts/OverlayContext';
import { useCheckers } from '@/hooks/useCheckers';
import { useTimeUntilMidnight } from '@/hooks/useTimeUntilMidnight';
import { useStreakReward } from '@/hooks/useStreakReward';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

type ListItem =
  | { type: 'divider'; key: string }
  | { type: 'checker'; key: string; id: number; label: string; color: string; checked: boolean; icon: string };

export default function Index() {
  const { checkers, allChecked, toggle, refresh, isLoading } = useCheckers();
  const { open: openPopOver, setPendingNewHabit } = useOverlay();
  const { hoursLeft } = useTimeUntilMidnight();
  const { tryGrantReward } = useStreakReward();
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
        tryGrantReward().catch(console.error);
      }
    }
    prevAllChecked.current = allChecked;
  }, [allChecked, openPopOver, tryGrantReward]);

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
    paddingBottom: Spacing.xxl,
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
