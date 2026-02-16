import { useState, useCallback } from 'react';
import { useResume } from '../context/ResumeContext';
import { normalizeSkills } from '../lib/skillsShape';
import './SkillsSection.css';

const CATEGORIES = [
  { id: 'technical', label: 'Technical Skills' },
  { id: 'soft', label: 'Soft Skills' },
  { id: 'tools', label: 'Tools & Technologies' },
];

function SkillTagInput({ category, skills, onAdd, onRemove }) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = input.trim();
      if (val) {
        onAdd(category, val);
        setInput('');
      }
    }
  };

  return (
    <div className="skills-tag-block">
      <div className="skills-pills">
        {(skills || []).map((skill, i) => (
          <span key={i} className="skills-pill">
            {skill}
            <button type="button" className="skills-pill-remove" onClick={() => onRemove(category, i)} aria-label="Remove">×</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        className="skills-tag-input"
        placeholder="Type skill and press Enter"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default function SkillsSection() {
  const { resume, addSkillToCategory, removeSkillFromCategory, suggestSkills } = useResume();
  const [suggestLoading, setSuggestLoading] = useState(false);
  const skills = normalizeSkills(resume.skills);

  const handleSuggest = useCallback(() => {
    setSuggestLoading(true);
    setTimeout(() => {
      suggestSkills();
      setSuggestLoading(false);
    }, 1000);
  }, [suggestSkills]);

  return (
    <section className="builder-section skills-section">
      <div className="skills-section-header">
        <h3 className="builder-section-title">Skills</h3>
        <button type="button" className="skills-suggest-btn" onClick={handleSuggest} disabled={suggestLoading}>
          {suggestLoading ? 'Adding…' : '✨ Suggest Skills'}
        </button>
      </div>
      {CATEGORIES.map(({ id, label }) => (
        <div key={id} className="skills-category">
          <h4 className="skills-category-title">{label} ({(skills[id] || []).length})</h4>
          <SkillTagInput
            category={id}
            skills={skills[id] || []}
            onAdd={addSkillToCategory}
            onRemove={removeSkillFromCategory}
          />
        </div>
      ))}
    </section>
  );
}
