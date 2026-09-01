/* ==========================================================================
   THEME MANAGER UTILITY
   Provides clean color theme definitions and switcher helpers.
   ========================================================================== */

export const THEMES = {
  'dark': {
    name: 'Cyan Dark',
    className: 'theme-cyberpunk',
    primaryHex: '#06b6d4',
    secondaryHex: '#8b5cf6',
    primaryNum: 0x06b6d4,
    secondaryNum: 0x8b5cf6,
    bgDark: '#08090d'
  },
  'violet': {
    name: 'Neon Violet',
    className: 'theme-purple',
    primaryHex: '#a855f7',
    secondaryHex: '#ec4899',
    primaryNum: 0xa855f7,
    secondaryNum: 0xec4899,
    bgDark: '#0b0813'
  },
  'emerald': {
    name: 'Emerald Green',
    className: 'theme-matrix',
    primaryHex: '#10b981',
    secondaryHex: '#06b6d4',
    primaryNum: 0x10b981,
    secondaryNum: 0x06b6d4,
    bgDark: '#050c08'
  },
  'black': {
    name: 'Pitch Black',
    className: 'theme-black',
    primaryHex: '#ffffff',
    secondaryHex: '#94a3b8',
    primaryNum: 0xffffff,
    secondaryNum: 0x94a3b8,
    bgDark: '#000000'
  },
  'amber': {
    name: 'Solar Amber',
    className: 'theme-gold',
    primaryHex: '#f59e0b',
    secondaryHex: '#ef4444',
    primaryNum: 0xf59e0b,
    secondaryNum: 0xef4444,
    bgDark: '#0d0a05'
  },
  'red': {
    name: 'Crimson Red',
    className: 'theme-red',
    primaryHex: '#ef4444',
    secondaryHex: '#f43f5e',
    primaryNum: 0xef4444,
    secondaryNum: 0xf43f5e,
    bgDark: '#0d0505'
  },
  'blue': {
    name: 'Midnight Blue',
    className: 'theme-blue',
    primaryHex: '#3b82f6',
    secondaryHex: '#06b6d4',
    primaryNum: 0x3b82f6,
    secondaryNum: 0x06b6d4,
    bgDark: '#050914'
  }
};

export function getNextTheme(currentKey) {
  const keys = Object.keys(THEMES);
  const nextIdx = (keys.indexOf(currentKey) + 1) % keys.length;
  return { key: keys[nextIdx], theme: THEMES[keys[nextIdx]] };
}
