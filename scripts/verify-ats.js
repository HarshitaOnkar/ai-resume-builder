/**
 * Verification script for ATS score logic.
 * Run: node scripts/verify-ats.js (from project root; may need Node ESM or run via vite)
 * Or run the assertions manually. This file documents expected behavior.
 */
import { computeATSScore, getATSScoreBand } from '../src/lib/atsScore.js';

const empty = {
  personal: { name: '', email: '', phone: '', location: '' },
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: { technical: [], soft: [], tools: [] },
  links: { github: '', linkedin: '' },
};

const full = {
  personal: { name: 'Jane Doe', email: 'jane@example.com', phone: '555-1234', location: '' },
  summary: 'Engineer who built and led teams. Designed systems and improved performance.',
  education: [{ school: 'U', degree: 'BS', dates: '2020', details: '' }],
  experience: [{ company: 'Co', role: 'Dev', dates: '2021', details: 'Did things.' }],
  projects: [{ title: 'P1', description: 'D', techStack: [], liveUrl: '', githubUrl: '' }],
  skills: { technical: ['a', 'b', 'c', 'd', 'e'], soft: [], tools: [] },
  links: { github: 'https://github.com/j', linkedin: 'https://linkedin.com/in/j' },
};

let ok = 0;
let fail = 0;

function assert(condition, msg) {
  if (condition) {
    ok++;
    console.log('  OK:', msg);
  } else {
    fail++;
    console.log('  FAIL:', msg);
  }
}

console.log('ATS verification\n');

const emptyResult = computeATSScore(empty);
assert(emptyResult.score === 0, 'Empty resume => score 0');
assert(emptyResult.suggestions.length > 0, 'Empty resume has suggestions');

const fullResult = computeATSScore(full);
assert(fullResult.score === 100, 'Full resume => score 100 (got ' + fullResult.score + ')');
assert(fullResult.suggestions.length === 0, 'Full resume has no suggestions');

const band0 = getATSScoreBand(0);
const band40 = getATSScoreBand(40);
const band41 = getATSScoreBand(41);
const band70 = getATSScoreBand(70);
const band71 = getATSScoreBand(71);
const band100 = getATSScoreBand(100);
assert(band0.theme === 'red' && band0.label === 'Needs Work', '0-40 => red Needs Work');
assert(band40.theme === 'red', '40 => red');
assert(band41.theme === 'amber' && band41.label === 'Getting There', '41-70 => amber Getting There');
assert(band70.theme === 'amber', '70 => amber');
assert(band71.theme === 'green' && band71.label === 'Strong Resume', '71-100 => green Strong Resume');
assert(band100.theme === 'green', '100 => green');

assert(computeATSScore(null).score === 0, 'null resume => score 0');

console.log('\n' + ok + ' passed, ' + fail + ' failed');
process.exit(fail > 0 ? 1 : 0);
