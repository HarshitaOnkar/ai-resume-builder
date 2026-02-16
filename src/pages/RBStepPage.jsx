import { Link, useLocation, Navigate } from 'react-router-dom';
import { RB_BASE, getStepByPath, getStepByNum, getNextStepPath, getPrevStepPath } from '../config/rbSteps';
import { hasStepArtifact } from '../lib/rbStorage';
import './RBStepPage.css';

export default function RBStepPage() {
  const location = useLocation();
  const pathSegment = location.pathname.replace(RB_BASE, '').replace(/^\/|\/$/g, '');
  const step = getStepByPath(pathSegment);
  if (!step) return <Navigate to={RB_BASE} replace />;

  const { stepNum, title } = step;

  // No skipping: redirect to first incomplete step if any previous step has no artifact
  for (let i = 1; i < stepNum; i++) {
    if (!hasStepArtifact(i)) {
      const firstIncomplete = getStepByNum(i);
      if (firstIncomplete) return <Navigate to={`${RB_BASE}/${firstIncomplete.path}`} replace />;
    }
  }
  const hasArtifact = hasStepArtifact(stepNum);
  const prevPath = getPrevStepPath(stepNum);
  const nextPath = getNextStepPath(stepNum);
  const canProceed = hasArtifact;
  const isFirst = stepNum === 1;
  const isLast = stepNum === 8;

  return (
    <div className="rb-step-page">
      <div className="rb-step-content">
        <p className="rb-step-placeholder">
          Step {stepNum}: <strong>{title}</strong>. Complete the build panel on the right and mark
          your result (It Worked / Error / Add Screenshot) to unlock Next.
        </p>
      </div>
      <nav className="rb-step-nav">
        {isFirst ? (
          <span className="rb-step-nav-pad" />
        ) : (
          <Link to={prevPath} className="rb-step-nav-btn">
            ← Previous
          </Link>
        )}
        <span className="rb-step-nav-label">
          Step {stepNum} of 8
          {!canProceed && (
            <span className="rb-step-nav-gate"> — upload artifact to continue</span>
          )}
        </span>
        {isLast ? (
          <Link
            to={`${RB_BASE}/proof`}
            className="rb-step-nav-btn"
            style={{ pointerEvents: canProceed ? 'auto' : 'none', opacity: canProceed ? 1 : 0.5 }}
            aria-disabled={!canProceed}
          >
            Proof →
          </Link>
        ) : (
          <Link
            to={nextPath}
            className="rb-step-nav-btn rb-step-nav-next"
            style={{ pointerEvents: canProceed ? 'auto' : 'none', opacity: canProceed ? 1 : 0.5 }}
            aria-disabled={!canProceed}
          >
            Next →
          </Link>
        )}
      </nav>
    </div>
  );
}
