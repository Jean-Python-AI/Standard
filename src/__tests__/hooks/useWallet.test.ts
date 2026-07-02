import { renderHook, act } from '@testing-library/react-native';
import { useWallet } from '@/hooks/useWallet';
import { COINS_STORAGE_KEY, LAST_REWARDED_STORAGE_KEY } from '@/constants';

const mockStore: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn((key: string) => Promise.resolve(mockStore[key] ?? null)),
    setItem: jest.fn((key: string, value: string) => {
      mockStore[key] = value;
      return Promise.resolve();
    }),
    removeItem: jest.fn((key: string) => {
      delete mockStore[key];
      return Promise.resolve();
    }),
  },
}));

describe('useWallet', () => {
  beforeEach(() => {
    Object.keys(mockStore).forEach(k => delete mockStore[k]);
    jest.clearAllMocks();
  });

  it('should initialize with 0 coins', async () => {
    const { result } = renderHook(() => useWallet());

    await act(async () => {});

    expect(result.current.coins).toBe(0);
    expect(result.current.isLoading).toBe(false);
  });

  it('should load coins from storage', async () => {
    mockStore[COINS_STORAGE_KEY] = '50';

    const { result } = renderHook(() => useWallet());

    await act(async () => {});

    expect(result.current.coins).toBe(50);
  });

  it('should add coins from zero', async () => {
    const { result } = renderHook(() => useWallet());

    await act(async () => {});

    await act(async () => {
      await result.current.addCoins(10);
    });

    expect(result.current.coins).toBe(10);
    expect(mockStore[COINS_STORAGE_KEY]).toBe('10');
  });

  it('should add coins to existing balance', async () => {
    mockStore[COINS_STORAGE_KEY] = '50';

    const { result } = renderHook(() => useWallet());

    await act(async () => {});

    await act(async () => {
      await result.current.addCoins(10);
    });

    expect(result.current.coins).toBe(60);
    expect(mockStore[COINS_STORAGE_KEY]).toBe('60');
  });

  it('should deduct coins when sufficient balance', async () => {
    mockStore[COINS_STORAGE_KEY] = '50';

    const { result } = renderHook(() => useWallet());

    await act(async () => {});

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.deductCoins(20);
    });

    expect(success).toBe(true);
    expect(result.current.coins).toBe(30);
    expect(mockStore[COINS_STORAGE_KEY]).toBe('30');
  });

  it('should reject deduction when insufficient balance', async () => {
    mockStore[COINS_STORAGE_KEY] = '5';

    const { result } = renderHook(() => useWallet());

    await act(async () => {});

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.deductCoins(10);
    });

    expect(success).toBe(false);
    expect(result.current.coins).toBe(5);
    expect(mockStore[COINS_STORAGE_KEY]).toBe('5');
  });

  it('should reject deduction when amount equals balance', async () => {
    mockStore[COINS_STORAGE_KEY] = '10';

    const { result } = renderHook(() => useWallet());

    await act(async () => {});

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.deductCoins(10);
    });

    expect(success).toBe(true);
    expect(result.current.coins).toBe(0);
  });

  it('should return 0 for lastRewardedStreak by default', async () => {
    const { result } = renderHook(() => useWallet());

    await act(async () => {});

    let value: number | undefined;
    await act(async () => {
      value = await result.current.getLastRewardedStreak();
    });

    expect(value).toBe(0);
  });

  it('should persist and retrieve lastRewardedStreak', async () => {
    const { result } = renderHook(() => useWallet());

    await act(async () => {});

    await act(async () => {
      await result.current.setLastRewardedStreak(14);
    });

    let value: number | undefined;
    await act(async () => {
      value = await result.current.getLastRewardedStreak();
    });

    expect(value).toBe(14);
    expect(mockStore[LAST_REWARDED_STORAGE_KEY]).toBe('14');
  });

  it('should overwrite lastRewardedStreak', async () => {
    const { result } = renderHook(() => useWallet());

    await act(async () => {});

    await act(async () => {
      await result.current.setLastRewardedStreak(7);
    });

    await act(async () => {
      await result.current.setLastRewardedStreak(14);
    });

    let value: number | undefined;
    await act(async () => {
      value = await result.current.getLastRewardedStreak();
    });

    expect(value).toBe(14);
  });

  it('should handle AsyncStorage getItem error gracefully', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));

    const { result } = renderHook(() => useWallet());

    await act(async () => {});

    expect(result.current.coins).toBe(0);
    expect(result.current.isLoading).toBe(false);
  });
});
