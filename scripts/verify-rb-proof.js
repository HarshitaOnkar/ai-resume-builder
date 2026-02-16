/**
 * Verify RB Proof: URL validation, persistence shape, copy format, shipped logic.
 * Run: node scripts/verify-rb-proof.js
 * Uses mock localStorage so getIsShipped can be tested.
 */

// Mock localStorage for Node
const store = {};
const mockLocalStorage = {
  getItem(k) { return store[k] ?? null; },
  setItem(k, v) { store[k] = String(v); },
};

// Copy isValidUrl logic (no localStorage)
function isValidUrl(str) {
  if (!str || typeof str !== 'string') return false;
  const trimmed = str.trim();
  if (!trimmed) return false;
  try {
    const u = new URL(trimmed);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

// Copy buildFinalSubmissionText output format
function buildFinalSubmissionText(links) {
  const lovable = (links.lovable || '').trim() || '(not set)';
  const github = (links.github || '').trim() || '(not set)';
  const deploy = (links.deploy || '').trim() || '(not set)';
  return [
    '------------------------------------------',
    'AI Resume Builder — Final Submission',
    '',
    `Lovable Project: ${lovable}`,
    `GitHub Repository: ${github}`,
    `Live Deployment: ${deploy}`,
    '',
    'Core Capabilities:',
    '- Structured resume builder',
    '- Deterministic ATS scoring',
    '- Template switching',
    '- PDF export with clean formatting',
    '- Persistence + validation checklist',
    '------------------------------------------',
  ].join('\n');
}

// Shipped logic: all 8 steps, all 10 checklist, all 3 links valid
function getStepsWithArtifacts(store) {
  return Array.from({ length: 8 }, (_, i) => {
    const v = store[`rb_step_${i + 1}_artifact`];
    return v != null && String(v).trim() !== '';
  });
}
function getChecklistFromStore(store) {
  try {
    const raw = store.rb_checklist;
    if (!raw) return Array(10).fill(false);
    const arr = JSON.parse(raw);
    return Array.isArray(arr) && arr.length === 10 ? arr.map(Boolean) : Array(10).fill(false);
  } catch {
    return Array(10).fill(false);
  }
}
function getFinalSubmissionFromStore(store) {
  try {
    const raw = store.rb_final_submission || store.rb_proof_links;
    return raw ? JSON.parse(raw) : { lovable: '', github: '', deploy: '' };
  } catch {
    return { lovable: '', github: '', deploy: '' };
  }
}
function getIsShippedFromStore(store) {
  const steps = getStepsWithArtifacts(store);
  const allStepsDone = steps.length === 8 && steps.every(Boolean);
  const checklist = getChecklistFromStore(store);
  const allChecklistDone = checklist.length === 10 && checklist.every(Boolean);
  const links = getFinalSubmissionFromStore(store);
  const allLinksValid =
    isValidUrl(links.lovable) && isValidUrl(links.github) && isValidUrl(links.deploy);
  return allStepsDone && allChecklistDone && allLinksValid;
}

let passed = 0;
let failed = 0;
function ok(cond, msg) {
  if (cond) { passed++; console.log('  OK:', msg); }
  else { failed++; console.log('  FAIL:', msg); }
}

console.log('RB Proof verification\n');

// 1) URL validation
console.log('1) URL validation');
ok(!isValidUrl(''), 'empty => false');
ok(!isValidUrl('   '), 'whitespace => false');
ok(!isValidUrl('abc'), 'plain text => false');
ok(!isValidUrl('ftp://x.com'), 'ftp => false');
ok(isValidUrl('https://example.com'), 'https => true');
ok(isValidUrl('http://github.com/foo'), 'http => true');
ok(isValidUrl('https://lovable.dev/projects/123'), 'https with path => true');
console.log('');

// 2) Copy format
console.log('2) Copy Final Submission format');
const links = {
  lovable: 'https://lovable.dev/p/1',
  github: 'https://github.com/u/repo',
  deploy: 'https://myapp.vercel.app',
};
const text = buildFinalSubmissionText(links);
ok(text.includes('AI Resume Builder — Final Submission'), 'contains title');
ok(text.includes('Lovable Project: https://lovable.dev'), 'contains Lovable link');
ok(text.includes('GitHub Repository: https://github.com'), 'contains GitHub link');
ok(text.includes('Live Deployment: https://myapp'), 'contains Deploy link');
ok(text.includes('Core Capabilities:'), 'contains Core Capabilities');
ok(text.includes('- Structured resume builder'), 'contains capability 1');
ok(text.includes('- Persistence + validation checklist'), 'contains capability 5');
ok(text.startsWith('------------------------------------------'), 'starts with dashes');
ok(text.endsWith('------------------------------------------'), 'ends with dashes');
console.log('');

// 3) Persistence key
console.log('3) Persistence (rb_final_submission)');
store.rb_final_submission = JSON.stringify(links);
const read = getFinalSubmissionFromStore(store);
ok(read.lovable === links.lovable && read.github === links.github && read.deploy === links.deploy, 'rb_final_submission round-trip');
console.log('');

// 4) Shipped only when ALL conditions met
console.log('4) Shipped = 8 steps + 10 checks + 3 valid links');

// Empty store => not shipped
store.rb_final_submission = null;
store.rb_checklist = null;
for (let i = 1; i <= 8; i++) store[`rb_step_${i}_artifact`] = '';
ok(!getIsShippedFromStore(store), 'empty store => not shipped');

// 8 steps only => not shipped
for (let i = 1; i <= 8; i++) store[`rb_step_${i}_artifact`] = 'x';
store.rb_checklist = JSON.stringify(Array(10).fill(false));
store.rb_final_submission = JSON.stringify({ lovable: '', github: '', deploy: '' });
ok(!getIsShippedFromStore(store), '8 steps only => not shipped');

// 8 steps + 10 checks, no links => not shipped
store.rb_checklist = JSON.stringify(Array(10).fill(true));
ok(!getIsShippedFromStore(store), '8 steps + 10 checks, no links => not shipped');

// 8 steps + 10 checks + 2 valid links => not shipped
store.rb_final_submission = JSON.stringify({
  lovable: 'https://a.com',
  github: 'https://b.com',
  deploy: '',
});
ok(!getIsShippedFromStore(store), 'only 2 links => not shipped');

// 8 steps + 10 checks + 3 valid links => shipped
store.rb_final_submission = JSON.stringify({
  lovable: 'https://lovable.dev/p/1',
  github: 'https://github.com/u/r',
  deploy: 'https://app.com',
});
ok(getIsShippedFromStore(store), '8 steps + 10 checks + 3 valid links => shipped');

// 8 steps + 9 checks + 3 links => not shipped
store.rb_checklist = JSON.stringify([...Array(9).fill(true), false]);
ok(!getIsShippedFromStore(store), '9/10 checks + 3 links => not shipped');

// 7 steps + 10 checks + 3 links => not shipped
store.rb_step_8_artifact = '';
store.rb_checklist = JSON.stringify(Array(10).fill(true));
ok(!getIsShippedFromStore(store), '7 steps + 10 checks + 3 links => not shipped');

console.log('');
console.log(passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
