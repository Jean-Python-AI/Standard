import { ColorsHabits } from '@/constants';
import type { ColorId } from '@/types/habit';
import { createContext, useContext, useState, type ReactNode } from 'react';

interface OnboardingData {
  name: string;
  setName: (name: string) => void;
  color: string;
  colorId: ColorId;
  setColorId: (id: ColorId) => void;
  icon: string;
  setIcon: (icon: string) => void;
  createdHabitId: number | null;
  setCreatedHabitId: (id: number | null) => void;
}

const OnboardingContext = createContext<OnboardingData | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState('');
  const [colorId, setColorId] = useState<ColorId>(0);
  const [icon, setIcon] = useState('Idea');
  const [createdHabitId, setCreatedHabitId] = useState<number | null>(null);

  const color = ColorsHabits[colorId] ?? ColorsHabits[0];

  return (
    <OnboardingContext.Provider value={{ name, setName, color, colorId, setColorId, icon, setIcon, createdHabitId, setCreatedHabitId }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}
