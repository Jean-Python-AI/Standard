export type ColorId = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Habit {
  id: number;
  label: string;
  colorId: ColorId;
  color: string;
  icon: string;
  price: number;
}

export interface Checker {
  id: number;
  label: string;
  color: string;
  checked: boolean;
  icon: string;
}
