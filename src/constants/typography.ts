import { Fonts } from './Fonts';

export const Typography = {
  heroNumber: { fontSize: 52, fontFamily: Fonts.bold },
  heroText: { fontSize: 40, fontFamily: Fonts.bold },
  h1: { fontSize: 24, fontFamily: Fonts.bold },
  h2: { fontSize: 20, fontFamily: Fonts.bold },
  h2Medium: { fontSize: 20, fontFamily: Fonts.medium },
  h3: { fontSize: 18, fontFamily: Fonts.bold },
  body: { fontSize: 18, fontFamily: Fonts.regular },
  bodyMedium: { fontSize: 18, fontFamily: Fonts.medium },
  bodySmall: { fontSize: 16, fontFamily: Fonts.medium },
  caption: { fontSize: 14, fontFamily: Fonts.medium },
  captionSmall: { fontSize: 12, fontFamily: Fonts.medium },
  percentSign: { fontSize: 40, fontFamily: Fonts.regular },
  input: { fontSize: 18, fontFamily: Fonts.regular },
  streakNumber: { fontSize: 22, fontFamily: Fonts.bold },
} as const;
