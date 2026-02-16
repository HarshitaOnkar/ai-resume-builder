import { useState, useCallback } from 'react';
import { useResume } from '../context/ResumeContext';
import { normalizeProject } from '../lib/projectsShape';
import BulletGuidance from './BulletGuidance';
import './ProjectsSection.css';

const DESC_MAX = 200;

function ProjectTechInput({ techStack, onChange }) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = input.trim();
      if (val && !techStack.includes(val)) {
        onChange([...techStack, val]);
        setInput('');
      }
    }
  };

  const remove = (i) => {
    const next = [...techStack];
    next.splice(i, 1);
    onChange(next);
  };

  return (
    <div className="project-tech-block">
      <div className="project-tech-pills">
        {(techStack || []).map((t, i) => (
          <span key={i} className="project-tech-pill">
            {t}
            <button type="button" className="project-tech-pill-remove" onClick={() => remove(i)} aria-label="Remove">×</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        className="project-tech-input"
        placeholder="Tech and press Enter"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

function ProjectEntry({ entry, index, onChange, onRemove }) {
  const [open, setOpen] = useState(true);
  const p = normalizeProject(entry);
  const title = p.title || 'Untitled Project';
  const descLen = (p.description || '').length;

  const update = (field, value) => {
    onChange({ ...p, [field]: value });
  };

  return (
    <div className="project-accordion-item">
      <div className="project-accordion-head" onClick={() => setOpen((o) => !o)}>
        <span className="project-accordion-title">{title}</span>
        <span className="project-accordion-toggle">{open ? '▼' : '▶'}</span>
      </div>
      {open && (
        <div className="project-accordion-body">
          <label className="builder-label">
            <span>Project Title</span>
            <input
              value={p.title}
              onChange={(e) => update('title', e.target.value)}
              className="builder-input"
            />
          </label>
          <label className="builder-label">
            <span>Description (max {DESC_MAX} chars)</span>
            <textarea
              value={p.description}
              onChange={(e) => update('description', e.target.value.slice(0, DESC_MAX))}
              rows={3}
              className="builder-input builder-textarea"
            />
            <span className="project-char-count">{descLen}/{DESC_MAX}</span>
            <BulletGuidance text={p.description ?? ''} />
          </label>
          <label className="builder-label">
            <span>Tech Stack</span>
            <ProjectTechInput techStack={p.techStack || []} onChange={(arr) => update('techStack', arr)} />
          </label>
          <label className="builder-label">
            <span>Live URL (optional)</span>
            <input
              type="url"
              value={p.liveUrl}
              onChange={(e) => update('liveUrl', e.target.value)}
              placeholder="https://..."
              className="builder-input"
            />
          </label>
          <label className="builder-label">
            <span>GitHub URL (optional)</span>
            <input
              type="url"
              value={p.githubUrl}
              onChange={(e) => update('githubUrl', e.target.value)}
              placeholder="https://github.com/..."
              className="builder-input"
            />
          </label>
          <button type="button" className="project-delete-btn" onClick={() => onRemove(index)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProjectsSection() {
  const { projects, updateProject, addProject, removeProject } = useResume();

  return (
    <section className="builder-section projects-section">
      <div className="projects-section-header">
        <h3 className="builder-section-title">Projects</h3>
        <button type="button" className="builder-add" onClick={addProject}>
          Add Project
        </button>
      </div>
      {projects.map((entry, i) => (
        <ProjectEntry
          key={i}
          entry={entry}
          index={i}
          onChange={(e) => updateProject(i, e)}
          onRemove={removeProject}
        />
      ))}
      {projects.length === 0 && (
        <p className="projects-empty">Click &quot;Add Project&quot; to add one.</p>
      )}
    </section>
  );
}
