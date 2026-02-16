import { useState, useCallback, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import TemplatePicker from '../components/TemplatePicker';
import ColorThemePicker from '../components/ColorThemePicker';
import { getStoredTemplate } from '../lib/templateStorage';
import { getStoredTheme, getThemeHsl } from '../lib/themeStorage';
import { resumeToPlainText, isResumeIncomplete } from '../lib/resumeExport';
import { normalizeSkills } from '../lib/skillsShape';
import { normalizeProject } from '../lib/projectsShape';
import ATSCircleScore from '../components/ATSCircleScore';
import '../styles/resumeTemplates.css';
import './PreviewPage.css';

export default function PreviewPage() {
  const [template, setTemplate] = useState(getStoredTemplate);
  const [theme, setTheme] = useState(getStoredTheme);
  const [incompleteWarning, setIncompleteWarning] = useState(false);
  const [pdfToast, setPdfToast] = useState(false);
  const { resume } = useResume();
  const { personal, summary, education, experience, projects, skills, links } = resume;
  const skillsObj = normalizeSkills(skills);
  const hasAnySkill = (skillsObj.technical?.length || 0) + (skillsObj.soft?.length || 0) + (skillsObj.tools?.length || 0) > 0;
  const templateClass = `template-${template}`;
  const accentHsl = getThemeHsl(theme);

  useEffect(() => {
    if (!pdfToast) return;
    const t = setTimeout(() => setPdfToast(false), 3000);
    return () => clearTimeout(t);
  }, [pdfToast]);

  const handlePrint = useCallback(() => {
    if (isResumeIncomplete(resume)) setIncompleteWarning(true);
    window.print();
    setPdfToast(true);
  }, [resume]);

  const handleCopyText = useCallback(() => {
    if (isResumeIncomplete(resume)) setIncompleteWarning(true);
    const text = resumeToPlainText(resume);
    navigator.clipboard.writeText(text || '');
  }, [resume]);

  return (
    <div className="preview-page">
      <div className="preview-export">
        <div className="preview-export-buttons">
          <button type="button" className="preview-export-btn" onClick={handlePrint}>
            Print / Save as PDF
          </button>
          <button type="button" className="preview-export-btn" onClick={handleCopyText}>
            Copy Resume as Text
          </button>
        </div>
        {incompleteWarning && (
          <p className="preview-export-warning" role="alert">
            Your resume may look incomplete.
          </p>
        )}
        {pdfToast && (
          <p className="preview-export-toast" role="status">
            PDF export ready! Check your downloads.
          </p>
        )}
      </div>
      <div className="preview-page-tabs">
        <TemplatePicker value={template} onChange={setTemplate} />
        <ColorThemePicker value={theme} onChange={setTheme} />
      </div>
      <ATSCircleScore resume={resume} />
      <div
        className={`preview-resume preview-resume-print ${templateClass}`}
        style={{ '--resume-accent': accentHsl }}
      >
        {template === 'modern' ? (
          <div className="preview-modern-wrap">
            <aside className="preview-sidebar">
              <header className="preview-header">
                <h1 className="preview-name">{personal?.name || 'Your name'}</h1>
                <div className="preview-contact">
                  {personal?.email && <span>{personal.email}</span>}
                  {personal?.phone && <span>{personal.phone}</span>}
                  {personal?.location && <span>{personal.location}</span>}
                </div>
              </header>
              {hasAnySkill && (
                <section className="preview-section">
                  <h2 className="preview-h2">Skills</h2>
                  <div className="preview-skills-groups">
                    {skillsObj.technical?.length > 0 && (
                      <div className="preview-skill-group">
                        <span className="preview-skill-label">Technical</span>
                        <div className="preview-pills">
                          {skillsObj.technical.map((s, j) => <span key={j} className="preview-pill">{s}</span>)}
                        </div>
                      </div>
                    )}
                    {skillsObj.soft?.length > 0 && (
                      <div className="preview-skill-group">
                        <span className="preview-skill-label">Soft</span>
                        <div className="preview-pills">
                          {skillsObj.soft.map((s, j) => <span key={j} className="preview-pill">{s}</span>)}
                        </div>
                      </div>
                    )}
                    {skillsObj.tools?.length > 0 && (
                      <div className="preview-skill-group">
                        <span className="preview-skill-label">Tools</span>
                        <div className="preview-pills">
                          {skillsObj.tools.map((s, j) => <span key={j} className="preview-pill">{s}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </aside>
            <div className="preview-main">
              {summary && (
                <section className="preview-section">
                  <h2 className="preview-h2">Summary</h2>
                  <p className="preview-p">{summary}</p>
                </section>
              )}
              {education?.length > 0 && (
                <section className="preview-section">
                  <h2 className="preview-h2">Education</h2>
                  {education.map((e, i) => (
                    <div key={i} className="preview-block">
                      <div className="preview-block-head">
                        <strong>{e.school}</strong>
                        <span>{e.dates}</span>
                      </div>
                      <div className="preview-block-sub">{e.degree}</div>
                      {e.details && <p className="preview-p">{e.details}</p>}
                    </div>
                  ))}
                </section>
              )}
              {experience?.length > 0 && (
                <section className="preview-section">
                  <h2 className="preview-h2">Experience</h2>
                  {experience.map((e, i) => (
                    <div key={i} className="preview-block">
                      <div className="preview-block-head">
                        <strong>{e.company}</strong>
                        <span>{e.dates}</span>
                      </div>
                      <div className="preview-block-sub">{e.role}</div>
                      {e.details && <p className="preview-p">{e.details}</p>}
                    </div>
                  ))}
                </section>
              )}
              {projects?.length > 0 && (
                <section className="preview-section">
                  <h2 className="preview-h2">Projects</h2>
                  {projects.map((e, i) => {
                    const p = normalizeProject(e);
                    const title = p.title || e.name || 'Project';
                    return (
                      <div key={i} className="preview-block preview-project-card">
                        <div className="preview-project-head">
                          <strong>{title}</strong>
                          <span className="preview-project-links">
                            {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="preview-link-icon" title="Live">🔗</a>}
                            {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="preview-link-icon" title="GitHub">⌘</a>}
                            {!p.liveUrl && !p.githubUrl && e.link && <a href={e.link} target="_blank" rel="noopener noreferrer" className="preview-link-icon">🔗</a>}
                          </span>
                        </div>
                        {p.description && <p className="preview-p">{p.description}</p>}
                        {p.techStack?.length > 0 && (
                          <div className="preview-tech-pills">
                            {p.techStack.map((t, j) => <span key={j} className="preview-tech-pill">{t}</span>)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </section>
              )}
              {(links?.github || links?.linkedin) && (
                <section className="preview-section">
                  <h2 className="preview-h2">Links</h2>
                  <p className="preview-p">
                    {links.github && <a href={links.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
                    {links.github && links.linkedin && ' · '}
                    {links.linkedin && <a href={links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                  </p>
                </section>
              )}
              {!personal?.name && !summary && !education?.length && !experience?.length && !projects?.length && !hasAnySkill && (
                <p className="preview-empty">Add content in Builder to see your resume here.</p>
              )}
            </div>
          </div>
        ) : (
          <>
            <header className="preview-header">
              <h1 className="preview-name">{personal?.name || 'Your name'}</h1>
              <div className="preview-contact">
                {personal?.email && <span>{personal.email}</span>}
                {personal?.phone && <span>{personal.phone}</span>}
                {personal?.location && <span>{personal.location}</span>}
              </div>
            </header>

            {summary && (
          <section className="preview-section">
            <h2 className="preview-h2">Summary</h2>
            <p className="preview-p">{summary}</p>
          </section>
        )}

        {education?.length > 0 && (
          <section className="preview-section">
            <h2 className="preview-h2">Education</h2>
            {education.map((e, i) => (
              <div key={i} className="preview-block">
                <div className="preview-block-head">
                  <strong>{e.school}</strong>
                  <span>{e.dates}</span>
                </div>
                <div className="preview-block-sub">{e.degree}</div>
                {e.details && <p className="preview-p">{e.details}</p>}
              </div>
            ))}
          </section>
        )}

        {experience?.length > 0 && (
          <section className="preview-section">
            <h2 className="preview-h2">Experience</h2>
            {experience.map((e, i) => (
              <div key={i} className="preview-block">
                <div className="preview-block-head">
                  <strong>{e.company}</strong>
                  <span>{e.dates}</span>
                </div>
                <div className="preview-block-sub">{e.role}</div>
                {e.details && <p className="preview-p">{e.details}</p>}
              </div>
            ))}
          </section>
        )}

        {projects?.length > 0 && (
          <section className="preview-section">
            <h2 className="preview-h2">Projects</h2>
            {projects.map((e, i) => {
              const p = normalizeProject(e);
              const title = p.title || e.name || 'Project';
              return (
                <div key={i} className="preview-block preview-project-card">
                  <div className="preview-project-head">
                    <strong>{title}</strong>
                    <span className="preview-project-links">
                      {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="preview-link-icon" title="Live">🔗</a>}
                      {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="preview-link-icon" title="GitHub">⌘</a>}
                      {!p.liveUrl && !p.githubUrl && e.link && <a href={e.link} target="_blank" rel="noopener noreferrer" className="preview-link-icon">🔗</a>}
                    </span>
                  </div>
                  {p.description && <p className="preview-p">{p.description}</p>}
                  {p.techStack?.length > 0 && (
                    <div className="preview-tech-pills">
                      {p.techStack.map((t, j) => <span key={j} className="preview-tech-pill">{t}</span>)}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {hasAnySkill && (
          <section className="preview-section">
            <h2 className="preview-h2">Skills</h2>
            <div className="preview-skills-groups">
              {skillsObj.technical?.length > 0 && (
                <div className="preview-skill-group">
                  <span className="preview-skill-label">Technical</span>
                  <div className="preview-pills">
                    {skillsObj.technical.map((s, j) => <span key={j} className="preview-pill">{s}</span>)}
                  </div>
                </div>
              )}
              {skillsObj.soft?.length > 0 && (
                <div className="preview-skill-group">
                  <span className="preview-skill-label">Soft</span>
                  <div className="preview-pills">
                    {skillsObj.soft.map((s, j) => <span key={j} className="preview-pill">{s}</span>)}
                  </div>
                </div>
              )}
              {skillsObj.tools?.length > 0 && (
                <div className="preview-skill-group">
                  <span className="preview-skill-label">Tools</span>
                  <div className="preview-pills">
                    {skillsObj.tools.map((s, j) => <span key={j} className="preview-pill">{s}</span>)}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {(links?.github || links?.linkedin) && (
          <section className="preview-section">
            <h2 className="preview-h2">Links</h2>
            <p className="preview-p">
              {links.github && <a href={links.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
              {links.github && links.linkedin && ' · '}
              {links.linkedin && <a href={links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
            </p>
          </section>
        )}

            {!personal?.name && !summary && !education?.length && !experience?.length && !projects?.length && !hasAnySkill && (
              <p className="preview-empty">Add content in Builder to see your resume here.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
