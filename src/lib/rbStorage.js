/**
 * Artifact storage for RB (Build Track) steps.
 * Keys: rb_step_1_artifact .. rb_step_8_artifact
 * Final submission: rb_final_submission
 * Checklist (10 items): rb_checklist
 */

const STEP_KEYS = Array.from({ length: 8 }, (_, i) => `rb_step_${i + 1}_artifact`);
const FINAL_SUBMISSION_KEY = 'rb_final_submission';
const CHECKLIST_KEY = 'rb_checklist';

export function getStepArtifact(stepNum) {
  if (stepNum < 1 || stepNum > 8) return null;
  return localStorage.getItem(STEP_KEYS[stepNum - 1]);
}

export function setStepArtifact(stepNum, value) {
  if (stepNum < 1 || stepNum > 8) return;
  localStorage.setItem(STEP_KEYS[stepNum - 1], value ?? '');
}

export function hasStepArtifact(stepNum) {
  const v = getStepArtifact(stepNum);
  return v != null && String(v).trim() !== '';
}

export function getStepsWithArtifacts() {
  return STEP_KEYS.map((_, i) => hasStepArtifact(i + 1));
}

/** Valid URL: http or https, non-empty. */
export function isValidUrl(str) {
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

/** Final submission links. Stored under rb_final_submission. */
export function getFinalSubmission() {
  try {
    let raw = localStorage.getItem(FINAL_SUBMISSION_KEY);
    if (!raw) raw = localStorage.getItem('rb_proof_links');
    return raw ? JSON.parse(raw) : { lovable: '', github: '', deploy: '' };
  } catch {
    return { lovable: '', github: '', deploy: '' };
  }
}

export function setFinalSubmission(links) {
  localStorage.setItem(FINAL_SUBMISSION_KEY, JSON.stringify(links));
}

/** Checklist: 10 booleans (all must be true to mark Shipped). */
const DEFAULT_CHECKLIST = Array(10).fill(false);

export function getChecklist() {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    if (!raw) return [...DEFAULT_CHECKLIST];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) && arr.length === 10
      ? arr.map((x) => !!x)
      : [...DEFAULT_CHECKLIST];
  } catch {
    return [...DEFAULT_CHECKLIST];
  }
}

export function setChecklist(checks) {
  const arr = Array.isArray(checks) && checks.length === 10
    ? checks.map((x) => !!x)
    : [...DEFAULT_CHECKLIST];
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(arr));
}

/** Shipped only if: all 8 steps completed, all 10 checklist passed, all 3 proof links valid. */
export function getIsShipped() {
  const steps = getStepsWithArtifacts();
  const allStepsDone = steps.length === 8 && steps.every(Boolean);
  const checklist = getChecklist();
  const allChecklistDone = checklist.length === 10 && checklist.every(Boolean);
  const links = getFinalSubmission();
  const allLinksValid =
    isValidUrl(links.lovable) &&
    isValidUrl(links.github) &&
    isValidUrl(links.deploy);
  return allStepsDone && allChecklistDone && allLinksValid;
}

/** Legacy: proof links (read/write now use rb_final_submission; keep for backward compat read). */
export function getProofLinks() {
  return getFinalSubmission();
}

export function setProofLinks(links) {
  setFinalSubmission(links);
}

/** Notify listeners that proof/checklist data changed (e.g. so status badge can update). */
export const RB_STORAGE_UPDATE = 'rb-storage-update';
export function notifyRbStorageUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(RB_STORAGE_UPDATE));
  }
}
