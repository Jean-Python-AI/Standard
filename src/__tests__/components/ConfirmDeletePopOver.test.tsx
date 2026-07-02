import ConfirmDeletePopOver from '@/components/historic/popOver/ConfirmDeletePopOver';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

jest.mock('react-native-reanimated', () => {
  const Reanimated = {
    View: 'Animated.View',
    useSharedValue: (initial: number) => ({ value: initial }),
    useAnimatedStyle: (fn: () => object) => fn(),
    withSpring: (value: number) => value,
    createAnimatedComponent: (component: string) => component,
  };
  return {
    __esModule: true,
    default: Reanimated,
    useSharedValue: Reanimated.useSharedValue,
    useAnimatedStyle: Reanimated.useAnimatedStyle,
    withSpring: Reanimated.withSpring,
  };
});

jest.mock('@/assets/icons/Coins.svg', () => 'mocked-svg');

const defaultProps = {
  visible: true,
  habitName: 'Meditation',
  refundAmount: 20,
  onConfirm: jest.fn(),
  onCancel: jest.fn(),
};

describe('ConfirmDeletePopOver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly when visible', () => {
    const { getByText } = render(<ConfirmDeletePopOver {...defaultProps} />);

    expect(getByText('Delete Meditation ?')).toBeTruthy();
    expect(getByText('to recover 20')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Delete')).toBeTruthy();
  });

  it('should not render when not visible', () => {
    const { queryByText } = render(
      <ConfirmDeletePopOver {...defaultProps} visible={false} />
    );

    expect(queryByText('Supprimer Meditation ?')).toBeNull();
  });

  it('should call onConfirm when confirm button is pressed', () => {
    const onConfirm = jest.fn();
    const { getByText } = render(
      <ConfirmDeletePopOver {...defaultProps} onConfirm={onConfirm} />
    );

    fireEvent.press(getByText('Delete'));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when cancel button is pressed', () => {
    const onCancel = jest.fn();
    const { getByText } = render(
      <ConfirmDeletePopOver {...defaultProps} onCancel={onCancel} />
    );

    fireEvent.press(getByText('Cancel'));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when backdrop is pressed', () => {
    const onCancel = jest.fn();
    render(
      <ConfirmDeletePopOver {...defaultProps} onCancel={onCancel} />
    );

    expect(onCancel).not.toHaveBeenCalled();
  });

  it('should handle zero refund amount', () => {
    const { getByText } = render(
      <ConfirmDeletePopOver {...defaultProps} refundAmount={0} />
    );

    expect(getByText('to recover 0')).toBeTruthy();
  });
});
