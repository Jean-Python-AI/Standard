export const SpringConfig = {
  gentle: { damping: 50, stiffness: 300 },
  snappy: { mass: 0.1, stiffness: 400 },
  bouncy: { mass: 0.3, stiffness: 300 },
  default: { mass: 0.5, stiffness: 300 },
} as const;

export const TimingConfig = {
  fast: { duration: 200 },
} as const;
