import '@/global.css';

export const colors = {
  bg: '#0B0E11',
  bgElevated: '#12171C',
  card: '#171D23',
  cardAlt: '#1C242C',
  line: '#2A343C',
  text: '#F4F7F5',
  muted: '#93A09A',
  faint: '#6C7A74',
  emerald: '#3DDC97',
  emeraldDim: '#14352A',
  emeraldText: '#B8F5D8',
  positive: '#3DDC97',
  negative: '#E07A7A',
  negativeDim: '#3A2224',
  gold: '#E2B657',
  goldDim: '#3A311C',
  white: '#FFFFFF',
} as const;

export const sliceColors = [
  '#3DDC97',
  '#7EB6A1',
  '#E2B657',
  '#8AA4B8',
  '#C48B8B',
  '#A9B3AE',
  '#6E8B74',
  '#D7C4A3',
] as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;
