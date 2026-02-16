import { getStoredTemplate, setStoredTemplate, TEMPLATE_OPTIONS } from '../lib/templateStorage';
import './TemplatePicker.css';

export default function TemplatePicker({ value, onChange }) {
  const current = value ?? getStoredTemplate();

  const handleSelect = (id) => {
    setStoredTemplate(id);
    onChange?.(id);
  };

  return (
    <div className="template-picker" role="tablist" aria-label="Resume template">
      {TEMPLATE_OPTIONS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={current === id}
          className={`template-picker-thumb ${current === id ? 'active' : ''}`}
          onClick={() => handleSelect(id)}
        >
          <div className={`template-picker-sketch template-picker-sketch-${id}`}>
            {id === 'classic' && (
              <>
                <div className="sketch-block sketch-name" />
                <div className="sketch-hr" />
                <div className="sketch-block sketch-sm" />
                <div className="sketch-hr" />
                <div className="sketch-block sketch-sm" />
                <div className="sketch-block sketch-sm" />
              </>
            )}
            {id === 'modern' && (
              <>
                <div className="sketch-sidebar" />
                <div className="sketch-main">
                  <div className="sketch-block sketch-name" />
                  <div className="sketch-block sketch-sm" />
                  <div className="sketch-block sketch-sm" />
                </div>
              </>
            )}
            {id === 'minimal' && (
              <>
                <div className="sketch-block sketch-name sketch-minimal" />
                <div className="sketch-gap" />
                <div className="sketch-block sketch-sm" />
                <div className="sketch-gap" />
                <div className="sketch-block sketch-sm" />
              </>
            )}
          </div>
          <span className="template-picker-label">{label}</span>
          {current === id && <span className="template-picker-check">✓</span>}
        </button>
      ))}
    </div>
  );
}
