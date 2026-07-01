import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

type SaveHandler = (id: number, label: string) => Promise<void>;
type DeleteHandler = (id: number) => Promise<void>;

interface BottomSheetContextType {
  visible: boolean;
  habitId: number | null;
  label: string;
  price: number;
  open: (id: number, label: string, price: number) => void;
  close: () => void;
  onSave: SaveHandler;
  onDelete: DeleteHandler;
  setCallbacks: (onSave: SaveHandler, onDelete: DeleteHandler) => void;
}

const BottomSheetContext = createContext<BottomSheetContextType>({
  visible: false,
  habitId: null,
  label: '',
  price: 0,
  open: () => {},
  close: () => {},
  onSave: async () => {},
  onDelete: async () => {},
  setCallbacks: () => {},
});

export function BottomSheetProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [habitId, setHabitId] = useState<number | null>(null);
  const [label, setLabel] = useState('');
  const [price, setPrice] = useState(0);
  const onSaveRef = useRef<SaveHandler>(async () => {});
  const onDeleteRef = useRef<DeleteHandler>(async () => {});

  const open = useCallback((id: number, lbl: string, prc: number = 0) => {
    setHabitId(id);
    setLabel(lbl);
    setPrice(prc);
    setVisible(true);
  }, []);

  const close = useCallback(() => setVisible(false), []);

  const setCallbacks = useCallback((onSave: SaveHandler, onDelete: DeleteHandler) => {
    onSaveRef.current = onSave;
    onDeleteRef.current = onDelete;
  }, []);

  const value = useMemo(() => ({
    visible, habitId, label, price, open, close,
    onSave: (id: number, lbl: string) => onSaveRef.current(id, lbl),
    onDelete: (id: number) => onDeleteRef.current(id),
    setCallbacks,
  }), [visible, habitId, label, price, open, close, setCallbacks]);

  return (
    <BottomSheetContext.Provider value={value}>
      {children}
    </BottomSheetContext.Provider>
  );
}

export const useBottomSheet = () => useContext(BottomSheetContext);
