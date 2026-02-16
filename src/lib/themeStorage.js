const THEME_KEY = 'resumeBuilderTheme';
const DEFAULT_THEME = 'teal';

export const THEME_OPTIONS = [
  { id: 'teal', label: 'Teal', hsl: 'hsl(168, 60%, 40%)' },
  { id: 'navy', label: 'Navy', hsl: 'hsl(220, 60%, 35%)' },
  { id: 'burgundy', label: 'Burgundy', hsl: 'hsl(345, 60%, 35%)' },
  { id: 'forest', label: 'Forest', hsl: 'hsl(150, 50%, 30%)' },
  { id: 'charcoal', label: 'Charcoal', hsl: 'hsl(0, 0%, 25%)' },
];

const ids = new Set(THEME_OPTIONS.map((t) => t.id));

export function getStoredTheme() {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v && ids.has(v)) return v;
    return DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function setStoredTheme(id) {
  try {
    localStorage.setItem(THEME_KEY, id);
  } catch (_) {}
}

export function getThemeHsl(themeId) {
  const t = THEME_OPTIONS.find((o) => o.id === themeId);
  return t ? t.hsl : THEME_OPTIONS[0].hsl;
}
