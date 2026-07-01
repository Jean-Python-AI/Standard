import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

interface OverlayContextType {
  open: (content?: ReactNode) => void;
  close: () => void;
  visible: boolean;
  content: ReactNode | null;
  pendingNewHabit: boolean;
  setPendingNewHabit: (value: boolean) => void;
}

const OverlayContext = createContext<OverlayContextType>({
  open: () => {},
  close: () => {},
  visible: false,
  content: null,
  pendingNewHabit: false,
  setPendingNewHabit: () => {},
});

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);
  const [pendingNewHabit, setPendingNewHabit] = useState(false);

  const open = useCallback((c?: ReactNode) => {
    if (c !== undefined) setContent(c);
    setVisible(true);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setContent(null);
  }, []);

  const value = useMemo(() => ({
    open,
    close,
    visible,
    content,
    pendingNewHabit,
    setPendingNewHabit,
  }), [open, close, visible, content, pendingNewHabit]);

  return (
    <OverlayContext.Provider value={value}>
      {children}
    </OverlayContext.Provider>
  );
}

export const useOverlay = () => useContext(OverlayContext);
