import { getBulletHints } from '../lib/bulletGuidance';
import './BulletGuidance.css';

/**
 * Renders subtle inline suggestions for a details/description field.
 * Per bullet: "Start with a strong action verb." and/or "Add measurable impact (numbers)."
 */
export default function BulletGuidance({ text }) {
  const hints = getBulletHints(text);
  if (hints.length === 0) return null;

  const withSuggestions = hints.filter((h) => h.needsVerb || h.needsNumber);
  if (withSuggestions.length === 0) return null;

  return (
    <div className="bullet-guidance">
      {withSuggestions.map((h, i) => (
        <div key={i} className="bullet-guidance-item">
          {h.needsVerb && (
            <span className="bullet-guidance-tip">Start with a strong action verb.</span>
          )}
          {h.needsVerb && h.needsNumber && ' '}
          {h.needsNumber && (
            <span className="bullet-guidance-tip">Add measurable impact (numbers).</span>
          )}
        </div>
      ))}
    </div>
  );
}
