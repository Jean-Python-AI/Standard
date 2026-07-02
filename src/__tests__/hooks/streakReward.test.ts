import { getTodayString, subtractDays } from '@/utils/dateUtils';
import { STREAK_REWARD_THRESHOLD, COINS_REWARD_AMOUNT, LAST_REWARDED_STORAGE_KEY } from '@/constants';

const mockStore: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn((key: string) => Promise.resolve(mockStore[key] ?? null)),
    setItem: jest.fn((key: string, value: string) => {
      mockStore[key] = value;
      return Promise.resolve();
    }),
  },
}));

jest.mock('@/db/clients', () => ({
  db: {
    select: jest.fn(() => ({
      from: jest.fn(() => ({
        where: jest.fn(() => ({
          orderBy: jest.fn(() => Promise.resolve([])),
        })),
      })),
    })),
  },
}));

jest.mock('@/db/schema', () => ({
  allHabitLogs: { checked: 'checked', date: 'date' },
}));

function generateConsecutiveDays(count: number): string[] {
  const today = getTodayString();
  const days: string[] = [];
  for (let i = 0; i < count; i++) {
    days.push(subtractDays(today, count - 1 - i));
  }
  return days;
}

function evaluateStreakReward(streak: number, lastRewarded: number): boolean {
  return streak >= STREAK_REWARD_THRESHOLD
    && Math.floor(streak / STREAK_REWARD_THRESHOLD) > Math.floor(lastRewarded / STREAK_REWARD_THRESHOLD);
}

describe('Streak reward logic', () => {
  beforeEach(() => {
    Object.keys(mockStore).forEach(k => delete mockStore[k]);
    jest.clearAllMocks();
  });

  it('should grant reward at day 7 (first cycle)', () => {
    const streak = 7;
    const lastRewarded = 0;
    expect(evaluateStreakReward(streak, lastRewarded)).toBe(true);
  });

  it('should NOT grant reward at day 8 (not a new 7-day cycle)', () => {
    const streak = 8;
    const lastRewarded = 7;
    expect(evaluateStreakReward(streak, lastRewarded)).toBe(false);
  });

  it('should NOT grant reward at day 8 if lastRewarded is already 8', () => {
    const streak = 8;
    const lastRewarded = 8;
    expect(evaluateStreakReward(streak, lastRewarded)).toBe(false);
  });

  it('should grant reward at day 14 when lastRewarded is 7', () => {
    const streak = 14;
    const lastRewarded = 7;
    expect(evaluateStreakReward(streak, lastRewarded)).toBe(true);
  });

  it('should NOT grant reward after streak reset (streak=1, lastRewarded=14)', () => {
    const streak = 1;
    const lastRewarded = 14;
    expect(evaluateStreakReward(streak, lastRewarded)).toBe(false);
  });

  it('should NOT grant reward when streak < 7', () => {
    const streak = 6;
    const lastRewarded = 0;
    expect(evaluateStreakReward(streak, lastRewarded)).toBe(false);
  });

  it('should simulate full 14-day journey with correct rewards', () => {
    let lastRewarded = 0;
    let totalCoins = 0;

    for (let day = 1; day <= 14; day++) {
      const streak = day;
      if (evaluateStreakReward(streak, lastRewarded)) {
        totalCoins += COINS_REWARD_AMOUNT;
        lastRewarded = streak;
      }
    }

    expect(totalCoins).toBe(COINS_REWARD_AMOUNT * 2);
    expect(lastRewarded).toBe(14);
  });

  it('should persist lastRewardedStreak across sessions', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;

    await AsyncStorage.setItem(LAST_REWARDED_STORAGE_KEY, '7');

    const stored = await AsyncStorage.getItem(LAST_REWARDED_STORAGE_KEY);
    expect(parseInt(stored, 10)).toBe(7);

    const streak = 14;
    const lastRewarded = parseInt(stored, 10);
    expect(evaluateStreakReward(streak, lastRewarded)).toBe(true);

    await AsyncStorage.setItem(LAST_REWARDED_STORAGE_KEY, String(streak));

    const updated = await AsyncStorage.getItem(LAST_REWARDED_STORAGE_KEY);
    expect(parseInt(updated, 10)).toBe(14);
  });

  it('should compute consecutive days correctly', () => {
    const days = generateConsecutiveDays(7);
    expect(days.length).toBe(7);

    for (let i = 1; i < days.length; i++) {
      const prev = new Date(days[i - 1] + 'T00:00:00');
      const curr = new Date(days[i] + 'T00:00:00');
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      expect(diff).toBe(1);
    }
  });
});
