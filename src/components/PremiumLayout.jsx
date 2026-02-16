import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { RB_BASE, RB_STEPS, getStepByPath } from '../config/rbSteps';
import { hasStepArtifact, getIsShipped, RB_STORAGE_UPDATE } from '../lib/rbStorage';
import BuildPanel from './BuildPanel';
import './PremiumLayout.css';

function TopBar({ stepNum, isProof, isShipped }) {
  const stepLabel = isProof ? 'Proof' : stepNum ? `Step ${stepNum} of 8` : null;
  const badge = isProof ? (isShipped ? 'Shipped' : 'Proof') : (stepNum ? `Step ${stepNum}` : 'Build Track');
  return (
    <header className="premium-topbar">
      <div className="premium-topbar-left">
        <Link to={RB_BASE}>AI Resume Builder</Link>
      </div>
      <div className="premium-topbar-center">
        {stepLabel ? `Project 3 — ${stepLabel}` : 'Project 3'}
      </div>
      <div className="premium-topbar-right">
        <span className={`premium-status-badge ${isShipped ? 'premium-status-shipped' : ''}`}>
          {badge}
        </span>
      </div>
    </header>
  );
}

function ContextHeader({ step, isProof }) {
  if (isProof) {
    return (
      <div className="premium-context-header">
        <h2>Proof &amp; submission</h2>
        <p>Review step completion and submit your links.</p>
      </div>
    );
  }
  if (!step) return null;
  return (
    <div className="premium-context-header">
      <h2>Step {step.stepNum}: {step.title}</h2>
      <p>Complete this step and upload your artifact to continue.</p>
    </div>
  );
}

function ProofFooter() {
  return (
    <footer className="premium-proof-footer">
      <Link to={`${RB_BASE}/proof`}>View proof &amp; submission →</Link>
    </footer>
  );
}

export default function PremiumLayout() {
  const location = useLocation();
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const handler = () => forceUpdate((n) => n + 1);
    window.addEventListener(RB_STORAGE_UPDATE, handler);
    return () => window.removeEventListener(RB_STORAGE_UPDATE, handler);
  }, []);
  const pathname = location.pathname;
  const isProof = pathname === `${RB_BASE}/proof`;
  const isShipped = isProof ? getIsShipped() : false;
  const pathSegment = pathname.replace(RB_BASE, '').replace(/^\/|\/$/g, '');
  const step = pathSegment ? getStepByPath(pathSegment) : null;
  const stepNum = step?.stepNum ?? null;
  const showBuildPanel = !isProof && stepNum != null;

  return (
    <div className="premium-layout">
      <TopBar stepNum={stepNum} isProof={isProof} isShipped={isShipped} />
      <ContextHeader step={step} isProof={isProof} />
      <div className="premium-workspace">
        <main className="premium-main">
          <Outlet context={{ step, stepNum, isProof }} />
        </main>
        {showBuildPanel && (
          <aside className="premium-build-panel">
            <BuildPanel stepNum={stepNum} />
          </aside>
        )}
        {isProof && <div className="premium-build-panel-placeholder" />}
      </div>
      <ProofFooter />
    </div>
  );
}
