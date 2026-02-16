import { getStoredTheme, setStoredTheme, THEME_OPTIONS } from '../lib/themeStorage';
import './ColorThemePicker.css';

export default function ColorThemePicker({ value, onChange }) {
  const current = value ?? getStoredTheme();

  const handleSelect = (id) => {
    setStoredTheme(id);
    onChange?.(id);
  };

  return (
    <div className="color-theme-picker" role="group" aria-label="Color theme">
      <span className="color-theme-picker-label">Accent color</span>
      <div className="color-theme-picker-swatches">
        {THEME_OPTIONS.map(({ id, hsl }) => (
          <button
            key={id}
            type="button"
            className="color-theme-swatch"
            style={{ background: hsl }}
            onClick={() => handleSelect(id)}
            title={id}
            aria-label={id}
          />
        ))}
      </div>
    </div>
  );
}
