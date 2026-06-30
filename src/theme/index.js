// StarPad Design Tokens — 粉蓝渐变原生风格
export const colors = {
  // Primary
  pink: '#ff5fb8',
  pinkLight: '#ff9a9e',
  pinkDark: '#e54a9e',
  blue: '#5a8dff',
  blueLight: '#8ab4ff',
  blueDark: '#3d6fdd',

  // Gradients
  gradientPink: ['#ff5fb8', '#ff9a9e'],
  gradientBlue: ['#5a8dff', '#8ab4ff'],
  gradientHero: ['#ff5fb8', '#5a8dff'],
  gradientWarm: ['#fff8f3', '#f4f7ff'],

  // Neutrals
  bg: '#f8f6f3',
  surface: '#ffffff',
  surfaceGlass: 'rgba(255,255,255,0.85)',
  textPrimary: '#1b2140',
  textSecondary: 'rgba(27,33,64,0.62)',
  textMuted: '#909399',
  border: 'rgba(90,110,170,0.08)',

  // Semantic
  like: '#f56c6c',
  member: '#e6a23c',
  success: '#67c23a',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  hero: 28,
};

// Shared shadow for cards
export const cardShadow = {
  shadowColor: 'rgba(90,110,170,0.15)',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 12,
  elevation: 4,
};