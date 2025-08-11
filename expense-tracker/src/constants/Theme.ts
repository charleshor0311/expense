export const LIGHT_THEME = {
  colors: {
    primary: '#FF6B9D',
    secondary: '#4ECDC4',
    accent: '#45B7D1',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#2D3436',
    textSecondary: '#636E72',
    border: '#DDD',
    success: '#00B894',
    warning: '#FDCB6E',
    error: '#E17055',
    income: '#6BCF7F',
    expense: '#FF6B6B',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
};

export const DARK_THEME = {
  ...LIGHT_THEME,
  colors: {
    ...LIGHT_THEME.colors,
    primary: '#FF8FA3',
    secondary: '#56C5BA',
    background: '#1A1A1A',
    surface: '#2D2D2D',
    text: '#FFFFFF',
    textSecondary: '#B2B2B2',
    border: '#404040',
  },
};

export type Theme = typeof LIGHT_THEME;