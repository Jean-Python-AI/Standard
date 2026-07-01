import { renderHook, waitFor } from '@testing-library/react-native';
import { useHabits } from '@/hooks/useHabits';

const mockSelect = jest.fn();
const mockFrom = jest.fn();

jest.mock('@/db/clients', () => ({
  db: {
    select: (...args: unknown[]) => {
      mockSelect(...args);
      return { from: mockFrom };
    },
  },
}));

describe('useHabits', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    mockFrom.mockResolvedValue([]);
    const { result } = renderHook(() => useHabits());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.habits).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should load habits on mount', async () => {
    const mockHabits = [
      { id: 1, name: 'Meditate', icon: 'idea', color: '#FF3B30', colorId: 0 },
      { id: 2, name: 'Exercise', icon: 'idea', color: '#ff8000', colorId: 1 },
    ];
    mockFrom.mockResolvedValue(mockHabits);

    const { result } = renderHook(() => useHabits());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.habits).toHaveLength(2);
    expect(result.current.habits[0].label).toBe('Meditate');
  });

  it('should handle error state', async () => {
    mockFrom.mockRejectedValue(new Error('DB Error'));

    const { result } = renderHook(() => useHabits());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('Erreur de chargement');
    expect(result.current.habits).toEqual([]);
  });
});
