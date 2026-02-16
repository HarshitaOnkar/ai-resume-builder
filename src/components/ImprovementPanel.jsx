import { useMemo } from 'react';
import { getTopImprovements } from '../lib/atsScore';
import './ImprovementPanel.css';

export default function ImprovementPanel({ resume }) {
  const improvements = useMemo(() => getTopImprovements(resume), [resume]);

  if (improvements.length === 0) return null;

  return (
    <div className="improvement-panel">
      <h3 className="improvement-panel-title">Top 3 Improvements</h3>
      <ul className="improvement-panel-list">
        {improvements.map((text, i) => (
          <li key={i} className="improvement-panel-item">{text}</li>
        ))}
      </ul>
    </div>
  );
}
