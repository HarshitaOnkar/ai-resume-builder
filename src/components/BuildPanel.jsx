import { useState, useCallback, useEffect } from 'react';
import { setStepArtifact, getStepArtifact } from '../lib/rbStorage';
import './BuildPanel.css';

const LOVABLE_URL = 'https://lovable.dev';

function statusFromArtifact(artifact) {
  if (!artifact || !artifact.trim()) return null;
  try {
    const data = JSON.parse(artifact);
    return data.status === 'screenshot' ? 'screenshot' : data.status === 'error' ? 'error' : data.status === 'worked' ? 'worked' : null;
  } catch {
    return null;
  }
}

export default function BuildPanel({ stepNum }) {
  const [copyText, setCopyText] = useState('');
  const [buildStatus, setBuildStatus] = useState(null); // null | 'worked' | 'error' | 'screenshot'
  const [screenshotUrl, setScreenshotUrl] = useState('');

  useEffect(() => {
    const raw = getStepArtifact(stepNum);
    setBuildStatus(statusFromArtifact(raw));
  }, [stepNum]);

  const handleCopy = useCallback(() => {
    if (!copyText.trim()) return;
    navigator.clipboard.writeText(copyText).then(() => {
      const prev = buildStatus;
      setBuildStatus(prev);
      // Could add a brief "Copied!" toast here
    });
  }, [copyText, buildStatus]);

  const markWorked = useCallback(() => {
    const artifact = JSON.stringify({
      status: 'worked',
      at: new Date().toISOString(),
    });
    setStepArtifact(stepNum, artifact);
    setBuildStatus('worked');
  }, [stepNum]);

  const markError = useCallback(() => {
    const artifact = JSON.stringify({
      status: 'error',
      at: new Date().toISOString(),
    });
    setStepArtifact(stepNum, artifact);
    setBuildStatus('error');
  }, [stepNum]);

  const markScreenshot = useCallback(() => {
    const url = screenshotUrl.trim() || '[screenshot added]';
    const artifact = JSON.stringify({
      status: 'screenshot',
      url,
      at: new Date().toISOString(),
    });
    setStepArtifact(stepNum, artifact);
    setBuildStatus('screenshot');
  }, [stepNum, screenshotUrl]);

  const openLovable = useCallback(() => {
    window.open(LOVABLE_URL, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <div className="build-panel">
      <h3 className="build-panel-title">Build panel</h3>
      <label className="build-panel-label">Copy This Into Lovable</label>
      <textarea
        className="build-panel-textarea"
        placeholder="Paste or type prompt/instructions for this step..."
        value={copyText}
        onChange={(e) => setCopyText(e.target.value)}
        rows={6}
      />
      <div className="build-panel-actions">
        <button type="button" className="build-panel-btn" onClick={handleCopy}>
          Copy
        </button>
        <button type="button" className="build-panel-btn build-panel-btn-primary" onClick={openLovable}>
          Build in Lovable
        </button>
      </div>
      <div className="build-panel-status">
        <span className="build-panel-status-label">Result:</span>
        <div className="build-panel-status-btns">
          <button
            type="button"
            className={`build-panel-status-btn ${buildStatus === 'worked' ? 'active' : ''}`}
            onClick={markWorked}
          >
            It Worked
          </button>
          <button
            type="button"
            className={`build-panel-status-btn ${buildStatus === 'error' ? 'active' : ''}`}
            onClick={markError}
          >
            Error
          </button>
          <div className="build-panel-screenshot-row">
            <input
              type="text"
              className="build-panel-screenshot-input"
              placeholder="Screenshot URL or note"
              value={screenshotUrl}
              onChange={(e) => setScreenshotUrl(e.target.value)}
            />
            <button
              type="button"
              className={`build-panel-status-btn ${buildStatus === 'screenshot' ? 'active' : ''}`}
              onClick={markScreenshot}
            >
              Add Screenshot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
