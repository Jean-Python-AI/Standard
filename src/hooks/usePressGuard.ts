import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

export function usePressGuard() {
  const [isPressed, setIsPressed] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsPressed(false);
    }, [])
  );

  const guard = useCallback(
    (action: () => void) => {
      if (isPressed) return;
      setIsPressed(true);
      action();
    },
    [isPressed]
  );

  return { guard, isPressed };
}
