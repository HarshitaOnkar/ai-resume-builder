import { useMemo } from 'react';
import { computeATSScore } from '../lib/atsScore';
import './ATSScoreMeter.css';

export default function ATSScoreMeter({ resume }) {
  const { score, suggestions } = useMemo(() => computeATSScore(resume), [resume]);

  return (
    <div className="ats-score-block">
      <h3 className="ats-score-label">ATS Readiness Score</h3>
      <div className="ats-score-meter" role="meter" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
        <div className="ats-score-track">
          <div className="ats-score-fill" style={{ width: `${score}%` }} />
        </div>
        <span className="ats-score-value">{score}</span>
      </div>
      {suggestions.length > 0 && (
        <ul className="ats-suggestions">
          {suggestions.map((text, i) => (
            <li key={i} className="ats-suggestion-item">{text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
