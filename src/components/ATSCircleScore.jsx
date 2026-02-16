import { useMemo } from 'react';
import { computeATSScore, getATSScoreBand } from '../lib/atsScore';
import './ATSCircleScore.css';

const SIZE = 120;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ATSCircleScore({ resume }) {
  const { score, suggestions } = useMemo(() => computeATSScore(resume), [resume]);
  const band = useMemo(() => getATSScoreBand(score), [score]);
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  return (
    <div className="ats-circle-block">
      <h3 className="ats-circle-title">ATS Resume Score</h3>
      <div className="ats-circle-wrap">
        <svg
          className="ats-circle-svg"
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="meter"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`ATS score ${score} out of 100`}
        >
          <circle
            className="ats-circle-bg"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
          />
          <circle
            className={`ats-circle-progress ats-circle-${band.theme}`}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </svg>
        <div className="ats-circle-center">
          <span className="ats-circle-value">{score}</span>
          <span className="ats-circle-label">{band.label}</span>
        </div>
      </div>
      {suggestions.length > 0 && (
        <ul className="ats-circle-suggestions" aria-label="Improvement suggestions">
          {suggestions.map((text, i) => (
            <li key={i} className="ats-circle-suggestion-item">{text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
