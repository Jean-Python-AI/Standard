import NewHabitContent from '@/components/historic/popOver/newHabit';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

jest.mock('@/assets/icons/edit.svg', () => 'mocked-svg');
jest.mock('@/assets/icons/Coins.svg', () => 'mocked-svg');

jest.mock('@/contexts/OverlayContext', () => ({
  useOverlay: () => ({
    close: jest.fn(),
  }),
}));

jest.mock('@/hooks/useHabitActions', () => ({
  useHabitActions: () => ({
    create: jest.fn().mockResolvedValue(true),
    isLoading: false,
    error: null,
  }),
}));

jest.mock('@/db/clients', () => ({
  db: {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockResolvedValue(undefined),
  },
}));

const defaultProps = {
  price: 10,
  coins: 50,
  onDeduct: jest.fn().mockResolvedValue(true),
};

describe('NewHabitContent', () => {
  it('should render correctly', () => {
    const { getByPlaceholderText, getByText } = render(<NewHabitContent {...defaultProps} />);

    expect(getByPlaceholderText('Name of the habit')).toBeTruthy();
    expect(getByText('Create a new habit')).toBeTruthy();
  });

  it('should call create when Create button is pressed', async () => {
    const mockCreate = jest.fn().mockResolvedValue(true);
    const mockOnDeduct = jest.fn().mockResolvedValue(true);
    const useHabitActions = require('@/hooks/useHabitActions');
    useHabitActions.useHabitActions = () => ({
      create: mockCreate,
      isLoading: false,
      error: null,
    });

    const { getByPlaceholderText, getByText } = render(
      <NewHabitContent price={10} coins={50} onDeduct={mockOnDeduct} />
    );

    fireEvent.changeText(getByPlaceholderText('Name of the habit'), 'Meditate');
    fireEvent.press(getByText('Create'));

    await waitFor(() => {
      expect(mockOnDeduct).toHaveBeenCalledWith(10);
      expect(mockCreate).toHaveBeenCalledWith('Meditate', 'idea', expect.any(String), 0, 10);
    });
  });

  it('should not create habit with empty name', async () => {
    const mockCreate = jest.fn().mockResolvedValue(true);
    const useHabitActions = require('@/hooks/useHabitActions');
    useHabitActions.useHabitActions = () => ({
      create: mockCreate,
      isLoading: false,
      error: null,
    });

    const { getByText } = render(<NewHabitContent {...defaultProps} />);
    fireEvent.press(getByText('Create'));

    await waitFor(() => {
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });
});
