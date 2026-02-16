import { useState, useCallback, useMemo } from 'react';
import {
  getStepsWithArtifacts,
  getFinalSubmission,
  setFinalSubmission,
  getChecklist,
  setChecklist,
  getIsShipped,
  isValidUrl,
  notifyRbStorageUpdate,
} from '../lib/rbStorage';
import { RB_STEPS } from '../config/rbSteps';
import './RBProofPage.css';

const CHECKLIST_LABELS = [
  'All form sections save to localStorage',
  'Live preview updates in real-time',
  'Template switching preserves data',
  'Color theme persists after refresh',
  'ATS score calculates correctly',
  'Score updates live on edit',
  'Export buttons work (copy/download)',
  'Empty states handled gracefully',
  'Mobile responsive layout works',
  'No console errors on any page',
];

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

export default function RBProofPage() {
  const stepStatus = getStepsWithArtifacts();
  const [links, setLinksState] = useState(() => getFinalSubmission());
  const [checklist, setChecklistState] = useState(() => getChecklist());
  const [touched, setTouched] = useState({ lovable: false, github: false, deploy: false });

  const setLink = useCallback((key, value) => {
    setTouched((p) => ({ ...p, [key]: true }));
    setLinksState((prev) => {
      const next = { ...prev, [key]: value };
      setFinalSubmission(next);
      notifyRbStorageUpdate();
      return next;
    });
  }, []);

  const toggleChecklist = useCallback((index) => {
    setChecklistState((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      setChecklist(next);
      notifyRbStorageUpdate();
      return next;
    });
  }, []);

  const isShipped = useMemo(() => getIsShipped(), [links, checklist, stepStatus]);

  const linkErrors = useMemo(() => ({
    lovable: touched.lovable && !isValidUrl(links.lovable) && links.lovable.trim() !== '',
    github: touched.github && !isValidUrl(links.github) && links.github.trim() !== '',
    deploy: touched.deploy && !isValidUrl(links.deploy) && links.deploy.trim() !== '',
  }), [links, touched]);

  const handleCopyFinal = useCallback(() => {
    const text = buildFinalSubmissionText(links);
    navigator.clipboard.writeText(text);
  }, [links]);

  return (
    <div className="rb-proof-page">
      {isShipped && (
        <p className="rb-proof-shipped-message" role="status">
          Project 3 Shipped Successfully.
        </p>
      )}

      <section className="rb-proof-section" aria-labelledby="rb-proof-steps-heading">
        <h3 id="rb-proof-steps-heading">Step Completion Overview</h3>
        <ul className="rb-proof-step-list">
          {RB_STEPS.map((s, i) => (
            <li key={s.stepNum} className={stepStatus[i] ? 'done' : 'pending'}>
              <span className="rb-proof-step-icon" aria-hidden>{stepStatus[i] ? '✅' : '○'}</span>
              Step {s.stepNum}: {s.title}
            </li>
          ))}
        </ul>
      </section>

      <section className="rb-proof-section" aria-labelledby="rb-proof-artifact-heading">
        <h3 id="rb-proof-artifact-heading">Artifact Collection (Required to mark Shipped)</h3>
        <div className="rb-proof-inputs">
          <label>
            <span>Lovable Project Link</span>
            <input
              type="url"
              value={links.lovable}
              onChange={(e) => setLink('lovable', e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, lovable: true }))}
              placeholder="https://..."
              className={linkErrors.lovable ? 'rb-proof-input-invalid' : ''}
              aria-invalid={linkErrors.lovable}
            />
            {linkErrors.lovable && (
              <span className="rb-proof-input-error">Please enter a valid URL (http or https).</span>
            )}
          </label>
          <label>
            <span>GitHub Repository Link</span>
            <input
              type="url"
              value={links.github}
              onChange={(e) => setLink('github', e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, github: true }))}
              placeholder="https://github.com/..."
              className={linkErrors.github ? 'rb-proof-input-invalid' : ''}
              aria-invalid={linkErrors.github}
            />
            {linkErrors.github && (
              <span className="rb-proof-input-error">Please enter a valid URL (http or https).</span>
            )}
          </label>
          <label>
            <span>Deployed URL</span>
            <input
              type="url"
              value={links.deploy}
              onChange={(e) => setLink('deploy', e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, deploy: true }))}
              placeholder="https://..."
              className={linkErrors.deploy ? 'rb-proof-input-invalid' : ''}
              aria-invalid={linkErrors.deploy}
            />
            {linkErrors.deploy && (
              <span className="rb-proof-input-error">Please enter a valid URL (http or https).</span>
            )}
          </label>
        </div>
      </section>

      <section className="rb-proof-section" aria-labelledby="rb-proof-checklist-heading">
        <h3 id="rb-proof-checklist-heading">Verification checklist (all required for Shipped)</h3>
        <ul className="rb-proof-checklist">
          {CHECKLIST_LABELS.map((label, i) => (
            <li key={i} className={checklist[i] ? 'done' : 'pending'}>
              <button
                type="button"
                className="rb-proof-checklist-btn"
                onClick={() => toggleChecklist(i)}
                aria-pressed={checklist[i]}
              >
                <span className="rb-proof-step-icon" aria-hidden>{checklist[i] ? '✅' : '○'}</span>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="rb-proof-actions">
        <button type="button" className="rb-proof-copy-btn" onClick={handleCopyFinal}>
          Copy Final Submission
        </button>
      </div>
    </div>
  );
}
