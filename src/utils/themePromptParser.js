/* ==========================================================================
   AI NATURAL LANGUAGE PROMPT THEME PARSER
   ========================================================================== */

export const THEME_DEFINITIONS = {
  'black': {
    name: 'Pitch Black',
    className: 'theme-black',
    primaryHex: '#ffffff',
    secondaryHex: '#94a3b8',
    primaryNum: 0xffffff,
    secondaryNum: 0x94a3b8,
    bgDark: '#000000',
    desc: 'Pitch Black / Stealth Dark Void theme applied.'
  },
  'cyberpunk': {
    name: 'Cyberpunk Cyan',
    className: 'theme-cyberpunk',
    primaryHex: '#06b6d4',
    secondaryHex: '#8b5cf6',
    primaryNum: 0x06b6d4,
    secondaryNum: 0x8b5cf6,
    bgDark: '#08090d',
    desc: 'Electric Cyberpunk Cyan & Neon Violet theme applied.'
  },
  'purple': {
    name: 'Neon Violet',
    className: 'theme-purple',
    primaryHex: '#a855f7',
    secondaryHex: '#ec4899',
    primaryNum: 0xa855f7,
    secondaryNum: 0xec4899,
    bgDark: '#0b0813',
    desc: 'Neon Violet & Cyber Pink theme applied.'
  },
  'matrix': {
    name: 'Matrix Emerald',
    className: 'theme-matrix',
    primaryHex: '#10b981',
    secondaryHex: '#06b6d4',
    primaryNum: 0x10b981,
    secondaryNum: 0x06b6d4,
    bgDark: '#050c08',
    desc: 'Matrix Hacker Emerald Green theme applied.'
  },
  'gold': {
    name: 'Solar Gold',
    className: 'theme-gold',
    primaryHex: '#f59e0b',
    secondaryHex: '#ef4444',
    primaryNum: 0xf59e0b,
    secondaryNum: 0xef4444,
    bgDark: '#0d0a05',
    desc: 'Solar Gold & Crimson Amber theme applied.'
  },
  'red': {
    name: 'Crimson Red',
    className: 'theme-red',
    primaryHex: '#ef4444',
    secondaryHex: '#f43f5e',
    primaryNum: 0xef4444,
    secondaryNum: 0xf43f5e,
    bgDark: '#0d0505',
    desc: 'Crimson Red & Flame theme applied.'
  },
  'blue': {
    name: 'Midnight Blue',
    className: 'theme-blue',
    primaryHex: '#3b82f6',
    secondaryHex: '#06b6d4',
    primaryNum: 0x3b82f6,
    secondaryNum: 0x06b6d4,
    bgDark: '#050914',
    desc: 'Deep Space Midnight Blue theme applied.'
  }
};

export function parseThemePrompt(promptText) {
  if (!promptText) return null;
  const input = promptText.toLowerCase().trim();

  // Check for hex color prompt e.g. "change theme to #ff0055"
  const hexMatch = input.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/);
  if (hexMatch) {
    const customHex = hexMatch[0];
    const num = parseInt(customHex.replace('#', ''), 16);
    return {
      name: `Custom (${customHex})`,
      className: 'theme-custom',
      primaryHex: customHex,
      secondaryHex: customHex,
      primaryNum: num,
      secondaryNum: num,
      isCustomHex: true,
      desc: `Custom hex color theme ${customHex} applied.`
    };
  }

  // Keywords matching
  if (input.includes('black') || input.includes('dark') || input.includes('stealth') || input.includes('pitch')) {
    return THEME_DEFINITIONS['black'];
  }
  if (input.includes('cyber') || input.includes('cyan') || input.includes('turquoise')) {
    return THEME_DEFINITIONS['cyberpunk'];
  }
  if (input.includes('purple') || input.includes('violet') || input.includes('magenta')) {
    return THEME_DEFINITIONS['purple'];
  }
  if (input.includes('matrix') || input.includes('green') || input.includes('emerald') || input.includes('hacker')) {
    return THEME_DEFINITIONS['matrix'];
  }
  if (input.includes('gold') || input.includes('yellow') || input.includes('amber') || input.includes('sun')) {
    return THEME_DEFINITIONS['gold'];
  }
  if (input.includes('red') || input.includes('crimson') || input.includes('flame') || input.includes('blood')) {
    return THEME_DEFINITIONS['red'];
  }
  if (input.includes('blue') || input.includes('midnight') || input.includes('ocean')) {
    return THEME_DEFINITIONS['blue'];
  }

  // Default fallback if unknown keyword
  return THEME_DEFINITIONS['black'];
}
