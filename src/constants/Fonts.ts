export const Fonts = {
  regular: 'Rubik-Regular',
  medium: 'Rubik-Medium',
  bold: 'Rubik-Bold',
} as const;

export type RubikFontFamily = typeof Fonts[keyof typeof Fonts];