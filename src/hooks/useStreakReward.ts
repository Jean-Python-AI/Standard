import { COINS_REWARD_AMOUNT, STREAK_REWARD_THRESHOLD } from '@/constants';
import { useCallback } from 'react';
import { useStreak } from './useStreak';
import { useWallet } from './useWallet';

export function useStreakReward() {
  const { streak } = useStreak();
  const { addCoins, getLastRewardedStreak, setLastRewardedStreak } = useWallet();

  const tryGrantReward = useCallback(async () => {
    if (streak < STREAK_REWARD_THRESHOLD) return;
    const lastRewarded = await getLastRewardedStreak();
    if (Math.floor(streak / STREAK_REWARD_THRESHOLD) <= Math.floor(lastRewarded / STREAK_REWARD_THRESHOLD)) return;
    await addCoins(COINS_REWARD_AMOUNT);
    await setLastRewardedStreak(streak);
  }, [streak, addCoins, getLastRewardedStreak, setLastRewardedStreak]);

  return { streak, tryGrantReward };
}
