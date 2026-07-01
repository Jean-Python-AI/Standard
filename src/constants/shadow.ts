import { Colors } from './Colors';

export const Shadows = {
  card: {
    shadowColor: Colors.inactive,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  popover: {
    shadowColor: Colors.Black,
    shadowOffset: { width: 5, height: 5 },
    shadowRadius: 2,
    shadowOpacity: 0.9,
    elevation: 15,
  },
} as const;
