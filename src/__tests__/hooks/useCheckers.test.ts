import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useCheckers } from '@/hooks/useCheckers';

jest.mock('@/db/clients', () => {
  const mockHabits = [
    { id: 1, name: 'Meditate', icon: 'idea', color: '#FF3B30', colorId: 0 },
    { id: 2, name: 'Exercise', icon: 'idea', color: '#ff8000', colorId: 1 },
  ];

  function makeQuery(data: unknown) {
    return {
      where: jest.fn().mockImplementation(() => makeQuery(data)),
      set: jest.fn().mockImplementation(() => makeQuery(undefined)),
      values: jest.fn().mockImplementation(() => makeQuery(undefined)),
      then: (resolve: (v: unknown) => void, reject?: (e: unknown) => void) =>
        Promise.resolve(data).then(resolve, reject),
    };
  }

  return {
    db: {
      select: () => ({
        from: () => makeQuery(mockHabits),
      }),
      insert: jest.fn(() => ({
        values: jest.fn().mockResolvedValue(undefined),
      })),
      update: jest.fn(() => ({
        set: jest.fn(() => makeQuery(undefined)),
      })),
    },
  };
});

describe('useCheckers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useCheckers());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.checkers).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should load habits on mount', async () => {
    const { result } = renderHook(() => useCheckers());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.checkers).toHaveLength(2);
    expect(result.current.checkers[0].label).toBe('Meditate');
    expect(result.current.checkers[0].checked).toBe(false);
  });

  it('should toggle checker state', async () => {
    const { result } = renderHook(() => useCheckers());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.toggle(1);
    });

    expect(result.current.checkers[0].checked).toBe(true);
    expect(result.current.checkedCount).toBe(1);

    await act(async () => {
      await result.current.toggle(1);
    });

    expect(result.current.checkers[0].checked).toBe(false);
    expect(result.current.checkedCount).toBe(0);
  });

  it('should load with default checked state when no logs exist', async () => {
    const { result } = renderHook(() => useCheckers());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.checkers).toHaveLength(2);
    expect(result.current.checkedCount).toBe(0);
    expect(result.current.allChecked).toBe(false);
  });
});
