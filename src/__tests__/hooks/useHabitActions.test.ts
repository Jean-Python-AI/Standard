import { renderHook, act } from '@testing-library/react-native';
import { useHabitActions } from '@/hooks/useHabitActions';

const mockReturning = jest.fn();
const mockValues = jest.fn(() => ({ returning: mockReturning }));
const mockWhereValues = jest.fn();
const mockWhereSelect = jest.fn();
const mockWhereDelete = jest.fn();

jest.mock('@/db/clients', () => ({
  db: {
    insert: () => ({ values: mockValues }),
    update: () => ({ set: () => ({ where: mockWhereValues }) }),
    select: () => ({ from: () => ({ where: mockWhereSelect }) }),
    delete: () => ({ where: mockWhereDelete }),
  },
}));

describe('useHabitActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a habit successfully', async () => {
    mockReturning.mockResolvedValue([{ id: 1 }]);

    const { result } = renderHook(() => useHabitActions());

    let res: number | false | undefined;
    await act(async () => {
      res = await result.current.create('Meditate', 'idea', '#FF3B30', 0, 10);
    });

    expect(res).toBe(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockValues).toHaveBeenCalledWith({ name: 'Meditate', icon: 'idea', color: '#FF3B30', colorId: 0, price: 10 });
  });

  it('should update a habit successfully', async () => {
    mockWhereValues.mockResolvedValue(undefined);

    const { result } = renderHook(() => useHabitActions());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.update(1, 'New Name');
    });

    expect(success).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockWhereValues).toHaveBeenCalled();
  });

  it('should delete a habit and return its price', async () => {
    mockWhereSelect.mockResolvedValue([{ price: 10 }]);
    mockWhereDelete.mockResolvedValue(undefined);

    const { result } = renderHook(() => useHabitActions());

    let price: number | undefined;
    await act(async () => {
      price = await result.current.remove(1);
    });

    expect(price).toBe(10);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockWhereDelete).toHaveBeenCalled();
  });

  it('should handle creation error', async () => {
    mockValues.mockReturnValue({ returning: jest.fn().mockRejectedValue(new Error('DB Error')) });

    const { result } = renderHook(() => useHabitActions());

    let res: number | false | undefined;
    await act(async () => {
      res = await result.current.create('Meditate', 'idea', '#FF3B30', 0, 10);
    });

    expect(res).toBe(false);
    expect(result.current.error).toBe('Erreur lors de la création');
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle update error', async () => {
    mockWhereValues.mockRejectedValue(new Error('DB Error'));

    const { result } = renderHook(() => useHabitActions());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.update(1, 'New Name');
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('Erreur lors de la mise à jour');
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle deletion error', async () => {
    mockWhereSelect.mockRejectedValue(new Error('DB Error'));

    const { result } = renderHook(() => useHabitActions());

    let price: number | undefined;
    await act(async () => {
      price = await result.current.remove(1);
    });

    expect(price).toBe(0);
    expect(result.current.error).toBe('Erreur lors de la suppression');
    expect(result.current.isLoading).toBe(false);
  });
});
