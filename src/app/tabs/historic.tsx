import CoinsIcon from '@/assets/icons/Coins.svg';
import Habits from '@/components/historic/habits';
import NewHabitContent from '@/components/historic/popOver/newHabit';
import TopBar from '@/components/historic/topBar';
import HabitTrack from '@/components/historic/track';
import LoadingSpinner from '@/components/Loading/LoadingSpinner';
import { BorderRadius, Colors, Fonts, IconSize, Spacing, Typography } from '@/constants';
import { useBottomSheet } from '@/contexts/BottomSheetContext';
import { useOverlay } from '@/contexts/OverlayContext';
import { getPrice, useHabitActions } from '@/hooks/useHabitActions';
import { useHabits } from '@/hooks/useHabits';
import { useSuccessRate } from '@/hooks/useSuccessRate';
import { useWallet } from '@/hooks/useWallet';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type ProcessingState = { id: number; phase: 'loading' | 'exiting' } | null;

const DividerLine = React.memo(function DividerLine() {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.divider} />
    </View>
  );
});

const RateView = React.memo(function RateView({ rate }: { rate: number | null }) {
  return (
    <View style={styles.rateContainer}>
      <Text style={styles.text}>{rate !== null ? `${rate}` : '..'}<Text style={styles.percent}>%</Text></Text>
      <Text style={styles.rateLabel}>of success</Text>
    </View>
  );
});

function HistoricScreen() {
  const { open: openBottomSheet, setCallbacks } = useBottomSheet();
  const { open: openPopOver, pendingNewHabit, setPendingNewHabit } = useOverlay();
  const { habits, refresh, isLoading } = useHabits();
  const { rate } = useSuccessRate();
  const { update, remove } = useHabitActions();
  const { coins, addCoins, deductCoins, refresh: refreshWallet } = useWallet();

  const [processingState, setProcessingState] = useState<ProcessingState>(null);

  const updateRef = useRef(update);
  const removeRef = useRef(remove);
  const refreshRef = useRef(refresh);
  const addCoinsRef = useRef(addCoins);
  updateRef.current = update;
  removeRef.current = remove;
  refreshRef.current = refresh;
  addCoinsRef.current = addCoins;

  const handleSave = useCallback(async (id: number, label: string) => {
    setProcessingState({ id, phase: 'loading' });
    await new Promise(r => setTimeout(r, 800));
    const success = await updateRef.current(id, label);
    setProcessingState(null);
    if (success) refreshRef.current();
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    setProcessingState({ id, phase: 'loading' });
    await new Promise(r => setTimeout(r, 800));
    setProcessingState({ id, phase: 'exiting' });
    await new Promise(r => setTimeout(r, 300));
    const refundedPrice = await removeRef.current(id);
    if (refundedPrice > 0) {
      await addCoinsRef.current(refundedPrice);
    }
    setProcessingState(null);
    refreshRef.current();
    refreshWallet();
  }, [refreshWallet]);

  useEffect(() => {
    setCallbacks(handleSave, handleDelete);
  }, [handleSave, handleDelete, setCallbacks]);

  useFocusEffect(
    useCallback(() => {
      refresh();
      refreshWallet();
    }, [refresh, refreshWallet])
  );

  useEffect(() => {
    if (pendingNewHabit) {
      setPendingNewHabit(false);
      openPopOver(
        <NewHabitContent
          onCreated={refresh}
          price={getPrice(habits.length)}
          coins={coins}
          onDeduct={deductCoins}
        />
      );
    }
  }, [pendingNewHabit, setPendingNewHabit, openPopOver, refresh, habits.length, coins, deductCoins]);

  const handleNewHabit = useCallback(() => {
    openPopOver(
      <NewHabitContent
        onCreated={refresh}
        price={getPrice(habits.length)}
        coins={coins}
        onDeduct={deductCoins}
      />
    );
  }, [openPopOver, refresh, habits.length, coins, deductCoins]);

  const handleEditHabit = useCallback((id: number, label: string) => {
    const habit = habits.find(h => h.id === id);
    openBottomSheet(id, label, habit?.price ?? 0);
  }, [openBottomSheet, habits]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <TopBar onNewHabitPress={handleNewHabit} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <RateView rate={rate} />
        <DividerLine />
        <View style={styles.walletRow}>
          <CoinsIcon width={IconSize.md} height={IconSize.md} />
          <Text style={styles.walletText}>{coins}</Text>
        </View>
        <DividerLine />
        <HabitTrack habits={habits} />
        <DividerLine />
        <Habits habits={habits} onEditHabit={handleEditHabit} onNewHabitPress={handleNewHabit} processingState={processingState} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    alignItems: 'center',
  },
  scroll: {
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingBottom: 200,
  },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  walletText: {
    ...Typography.h1,
    fontFamily: Fonts.bold,
  },
  rateContainer: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  text: {
    ...Typography.heroNumber,
    marginBottom: -6,
  },
  percent: {
    ...Typography.percentSign,
  },
  rateLabel: {
    ...Typography.h2Medium,
    color: Colors.secondary,
  },
  dividerRow: {
    width: '100%',
    alignItems: 'center',
  },
  divider: {
    width: '80%',
    height: 2,
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.xs,
  },
});

export default React.memo(HistoricScreen);
