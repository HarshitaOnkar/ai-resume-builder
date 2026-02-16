import { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import ResumePreviewShell from '../components/ResumePreviewShell';
import ATSScoreMeter from '../components/ATSScoreMeter';
import ImprovementPanel from '../components/ImprovementPanel';
import TemplatePicker from '../components/TemplatePicker';
import ColorThemePicker from '../components/ColorThemePicker';
import BulletGuidance from '../components/BulletGuidance';
import SkillsSection from '../components/SkillsSection';
import ProjectsSection from '../components/ProjectsSection';
import { getStoredTemplate } from '../lib/templateStorage';
import { getStoredTheme } from '../lib/themeStorage';
import '../styles/resumeTemplates.css';
import './BuilderPage.css';

function FormSection({ title, children }) {
  return (
    <section className="builder-section">
      <h3 className="builder-section-title">{title}</h3>
      {children}
    </section>
  );
}

function EditableEntry({ entry, onChange, onRemove, fields }) {
  return (
    <div className="builder-entry">
      {fields.map(({ key, label, multiline }) => (
        <label key={key} className="builder-label">
          <span>{label}</span>
          {multiline ? (
            <textarea
              value={entry[key] ?? ''}
              onChange={(e) => onChange({ ...entry, [key]: e.target.value })}
              rows={2}
              className="builder-input builder-textarea"
            />
          ) : (
            <input
              type="text"
              value={entry[key] ?? ''}
              onChange={(e) => onChange({ ...entry, [key]: e.target.value })}
              className="builder-input"
            />
          )}
        </label>
      ))}
      <button type="button" className="builder-remove" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}

export default function BuilderPage() {
  const [template, setTemplate] = useState(getStoredTemplate);
  const [theme, setTheme] = useState(getStoredTheme);
  const {
    resume,
    updatePersonal,
    updateSummary,
    education,
    updateEducation,
    addEducation,
    removeEducation,
    experience,
    updateExperience,
    addExperience,
    removeExperience,
    updateLinks,
    loadSampleData,
  } = useResume();

  const { personal, summary, links } = resume;

  return (
    <div className="builder-page">
      <div className="builder-form-col">
        <div className="builder-form-header">
          <h2 className="builder-form-title">Resume details</h2>
          <button type="button" className="builder-sample-btn" onClick={loadSampleData}>
            Load Sample Data
          </button>
        </div>

        <FormSection title="Personal Info">
          <label className="builder-label">
            <span>Name</span>
            <input
              value={personal.name}
              onChange={(e) => updatePersonal('name', e.target.value)}
              className="builder-input"
            />
          </label>
          <label className="builder-label">
            <span>Email</span>
            <input
              type="email"
              value={personal.email}
              onChange={(e) => updatePersonal('email', e.target.value)}
              className="builder-input"
            />
          </label>
          <label className="builder-label">
            <span>Phone</span>
            <input
              type="tel"
              value={personal.phone}
              onChange={(e) => updatePersonal('phone', e.target.value)}
              className="builder-input"
            />
          </label>
          <label className="builder-label">
            <span>Location</span>
            <input
              value={personal.location}
              onChange={(e) => updatePersonal('location', e.target.value)}
              className="builder-input"
            />
          </label>
        </FormSection>

        <FormSection title="Summary">
          <label className="builder-label">
            <span>Professional summary</span>
            <textarea
              value={summary}
              onChange={(e) => updateSummary(e.target.value)}
              rows={4}
              className="builder-input builder-textarea"
            />
          </label>
        </FormSection>

        <FormSection title="Education">
          {education.map((entry, i) => (
            <EditableEntry
              key={i}
              entry={entry}
              onChange={(e) => updateEducation(i, e)}
              onRemove={() => removeEducation(i)}
              fields={[
                { key: 'school', label: 'School' },
                { key: 'degree', label: 'Degree' },
                { key: 'dates', label: 'Dates' },
                { key: 'details', label: 'Details', multiline: true },
              ]}
            />
          ))}
          <button type="button" className="builder-add" onClick={addEducation}>
            + Add education
          </button>
        </FormSection>

        <FormSection title="Experience">
          {experience.map((entry, i) => (
            <div key={i} className="builder-entry">
              <label className="builder-label">
                <span>Company</span>
                <input
                  value={entry.company ?? ''}
                  onChange={(e) => updateExperience(i, { ...entry, company: e.target.value })}
                  className="builder-input"
                />
              </label>
              <label className="builder-label">
                <span>Role</span>
                <input
                  value={entry.role ?? ''}
                  onChange={(e) => updateExperience(i, { ...entry, role: e.target.value })}
                  className="builder-input"
                />
              </label>
              <label className="builder-label">
                <span>Dates</span>
                <input
                  value={entry.dates ?? ''}
                  onChange={(e) => updateExperience(i, { ...entry, dates: e.target.value })}
                  className="builder-input"
                />
              </label>
              <label className="builder-label">
                <span>Details (one bullet per line)</span>
                <textarea
                  value={entry.details ?? ''}
                  onChange={(e) => updateExperience(i, { ...entry, details: e.target.value })}
                  rows={2}
                  className="builder-input builder-textarea"
                />
                <BulletGuidance text={entry.details ?? ''} />
              </label>
              <button type="button" className="builder-remove" onClick={() => removeExperience(i)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="builder-add" onClick={addExperience}>
            + Add experience
          </button>
        </FormSection>

        <ProjectsSection />

        <SkillsSection />

        <FormSection title="Links">
          <label className="builder-label">
            <span>GitHub</span>
            <input
              type="url"
              value={links.github}
              onChange={(e) => updateLinks('github', e.target.value)}
              placeholder="https://github.com/..."
              className="builder-input"
            />
          </label>
          <label className="builder-label">
            <span>LinkedIn</span>
            <input
              type="url"
              value={links.linkedin}
              onChange={(e) => updateLinks('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="builder-input"
            />
          </label>
        </FormSection>
      </div>

      <aside className="builder-preview-col">
        <div className="builder-preview-sticky">
          <ATSScoreMeter resume={resume} />
          <ImprovementPanel resume={resume} />
          <h3 className="builder-preview-title">Template</h3>
          <TemplatePicker value={template} onChange={setTemplate} />
          <ColorThemePicker value={theme} onChange={setTheme} />
          <h3 className="builder-preview-title">Live preview</h3>
          <ResumePreviewShell resume={resume} template={template} theme={theme} />
        </div>
      </aside>
    </div>
  );
}
