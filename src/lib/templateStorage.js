const TEMPLATE_KEY = 'resumeBuilderTemplate';
const DEFAULT_TEMPLATE = 'classic';

export const TEMPLATE_OPTIONS = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
];

export function getStoredTemplate() {
  try {
    const v = localStorage.getItem(TEMPLATE_KEY);
    if (v === 'classic' || v === 'modern' || v === 'minimal') return v;
    return DEFAULT_TEMPLATE;
  } catch {
    return DEFAULT_TEMPLATE;
  }
}

export function setStoredTemplate(id) {
  try {
    localStorage.setItem(TEMPLATE_KEY, id);
  } catch (_) {}
}
