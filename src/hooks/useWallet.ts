import AsyncStorage from '@react-native-async-storage/async-storage';
import { COINS_STORAGE_KEY, LAST_REWARDED_STORAGE_KEY } from '@/constants';
import { useCallback, useEffect, useState } from 'react';

export function useWallet() {
  const [coins, setCoins] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(COINS_STORAGE_KEY);
      setCoins(raw ? parseInt(raw, 10) : 0);
    } catch (e) {
      console.error('Failed to load coins:', e);
      setCoins(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(async (newAmount: number) => {
    setCoins(newAmount);
    await AsyncStorage.setItem(COINS_STORAGE_KEY, String(newAmount));
  }, []);

  const addCoins = useCallback(async (amount: number) => {
    const raw = await AsyncStorage.getItem(COINS_STORAGE_KEY);
    const current = raw ? parseInt(raw, 10) : 0;
    await save(current + amount);
  }, [save]);

  const deductCoins = useCallback(async (amount: number): Promise<boolean> => {
    const raw = await AsyncStorage.getItem(COINS_STORAGE_KEY);
    const current = raw ? parseInt(raw, 10) : 0;
    if (current < amount) return false;
    await save(current - amount);
    return true;
  }, [save]);

  const getLastRewardedStreak = useCallback(async (): Promise<number> => {
    const raw = await AsyncStorage.getItem(LAST_REWARDED_STORAGE_KEY);
    return raw ? parseInt(raw, 10) : 0;
  }, []);

  const setLastRewardedStreak = useCallback(async (value: number) => {
    await AsyncStorage.setItem(LAST_REWARDED_STORAGE_KEY, String(value));
  }, []);

  return { coins, isLoading, addCoins, deductCoins, refresh, getLastRewardedStreak, setLastRewardedStreak };
}
