import { getStoredTemplate, setStoredTemplate, TEMPLATE_OPTIONS } from '../lib/templateStorage';
import './TemplateTabs.css';

export default function TemplateTabs({ value, onChange }) {
  const current = value ?? getStoredTemplate();

  const handleSelect = (id) => {
    setStoredTemplate(id);
    onChange?.(id);
  };

  return (
    <div className="template-tabs" role="tablist" aria-label="Resume template">
      {TEMPLATE_OPTIONS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={current === id}
          className={`template-tab ${current === id ? 'active' : ''}`}
          onClick={() => handleSelect(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
