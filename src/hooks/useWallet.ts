import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const COINS_KEY = 'coins';

export function useWallet() {
  const [coins, setCoins] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(COINS_KEY);
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
    await AsyncStorage.setItem(COINS_KEY, String(newAmount));
  }, []);

  const addCoins = useCallback(async (amount: number) => {
    const newAmount = coins + amount;
    await save(newAmount);
  }, [coins, save]);

  const deductCoins = useCallback(async (amount: number): Promise<boolean> => {
    if (coins < amount) return false;
    const newAmount = coins - amount;
    await save(newAmount);
    return true;
  }, [coins, save]);

  return { coins, isLoading, addCoins, deductCoins, refresh };
}
