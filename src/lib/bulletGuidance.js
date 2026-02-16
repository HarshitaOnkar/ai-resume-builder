/**
 * Bullet discipline: action verb + measurable impact.
 * Guidance only; does not block input.
 */

const ACTION_VERBS = [
  'built', 'developed', 'designed', 'implemented', 'led', 'improved',
  'created', 'optimized', 'automated', 'launched', 'managed', 'delivered',
  'established', 'reduced', 'increased', 'achieved', 'coordinated', 'drove',
];

function trimBullet(line) {
  const t = (line || '').trim();
  return t.replace(/^[•\-*]\s*/, '');
}

function startsWithActionVerb(text) {
  const t = trimBullet(text).toLowerCase();
  const firstWord = t.split(/\s+/)[0] || '';
  return ACTION_VERBS.some((verb) => firstWord === verb);
}

function hasNumericIndicator(text) {
  if (!text || typeof text !== 'string') return false;
  return /\d|%|k\b|K\b|\+\s*\d|x\s*\d/i.test(text);
}

/**
 * Split details/description into bullet lines (by newline).
 * Returns array of { line, needsVerb, needsNumber }.
 */
export function getBulletHints(text) {
  if (!text || typeof text !== 'string') return [];
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
  return lines.map((line) => ({
    line,
    needsVerb: !startsWithActionVerb(line),
    needsNumber: !hasNumericIndicator(line),
  }));
}
