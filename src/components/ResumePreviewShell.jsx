import { normalizeSkills } from '../lib/skillsShape';
import { normalizeProject } from '../lib/projectsShape';
import { getThemeHsl } from '../lib/themeStorage';

/**
 * Structured resume layout placeholder for the builder live preview.
 * template: 'classic' | 'modern' | 'minimal'. theme: accent color id for --resume-accent.
 */
export default function ResumePreviewShell({ resume, template = 'classic', theme }) {
  const { personal, summary, education, experience, projects, skills, links } = resume;
  const skillsObj = normalizeSkills(skills);
  const hasAnySkill = (skillsObj.technical?.length || 0) + (skillsObj.soft?.length || 0) + (skillsObj.tools?.length || 0) > 0;
  const templateClass = `template-${template}`;
  const accentHsl = getThemeHsl(theme);

  const headerBlock = (
    <header className="resume-shell-header">
        <h1 className="resume-shell-name">{personal?.name || 'Your name'}</h1>
        <div className="resume-shell-contact">
          {[personal?.email, personal?.phone, personal?.location]
            .filter(Boolean)
            .join(' · ') || 'Email · Phone · Location'}
        </div>
      </header>
  );

  const skillsBlock = hasAnySkill && (
    <section className="resume-shell-section">
      <h2 className="resume-shell-h2">Skills</h2>
      <div className="resume-shell-skills-groups">
        {skillsObj.technical?.length > 0 && (
          <div className="resume-shell-skill-group">
            <span className="resume-shell-skill-label">Technical</span>
            <div className="resume-shell-pills">
              {skillsObj.technical.map((s, j) => <span key={j} className="resume-shell-pill">{s}</span>)}
            </div>
          </div>
        )}
        {skillsObj.soft?.length > 0 && (
          <div className="resume-shell-skill-group">
            <span className="resume-shell-skill-label">Soft</span>
            <div className="resume-shell-pills">
              {skillsObj.soft.map((s, j) => <span key={j} className="resume-shell-pill">{s}</span>)}
            </div>
          </div>
        )}
        {skillsObj.tools?.length > 0 && (
          <div className="resume-shell-skill-group">
            <span className="resume-shell-skill-label">Tools</span>
            <div className="resume-shell-pills">
              {skillsObj.tools.map((s, j) => <span key={j} className="resume-shell-pill">{s}</span>)}
            </div>
          </div>
        )}
      </div>
    </section>
  );

  const mainContent = (
    <>
      {summary && (
        <section className="resume-shell-section">
          <h2 className="resume-shell-h2">Summary</h2>
          <p className="resume-shell-p">{summary}</p>
        </section>
      )}

      {education?.length > 0 && (
        <section className="resume-shell-section">
          <h2 className="resume-shell-h2">Education</h2>
          {education.map((e, i) => (
            <div key={i} className="resume-shell-block">
              <div className="resume-shell-block-head">
                <strong>{e.school || 'School'}</strong>
                <span>{e.dates}</span>
              </div>
              <div className="resume-shell-block-sub">{e.degree}</div>
              {e.details && <p className="resume-shell-p">{e.details}</p>}
            </div>
          ))}
        </section>
      )}

      {experience?.length > 0 && (
        <section className="resume-shell-section">
          <h2 className="resume-shell-h2">Experience</h2>
          {experience.map((e, i) => (
            <div key={i} className="resume-shell-block">
              <div className="resume-shell-block-head">
                <strong>{e.company || 'Company'}</strong>
                <span>{e.dates}</span>
              </div>
              <div className="resume-shell-block-sub">{e.role}</div>
              {e.details && <p className="resume-shell-p">{e.details}</p>}
            </div>
          ))}
        </section>
      )}

      {projects?.length > 0 && (
        <section className="resume-shell-section">
          <h2 className="resume-shell-h2">Projects</h2>
          {projects.map((e, i) => {
            const p = normalizeProject(e);
            const title = p.title || e.name || 'Project';
            return (
              <div key={i} className="resume-shell-block resume-shell-project-card">
                <div className="resume-shell-project-head">
                  <strong>{title}</strong>
                  <span className="resume-shell-project-links">
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="resume-shell-link-icon" title="Live">🔗</a>}
                    {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="resume-shell-link-icon" title="GitHub">⌘</a>}
                    {!p.liveUrl && !p.githubUrl && e.link && <a href={e.link} target="_blank" rel="noopener noreferrer" className="resume-shell-link-icon">🔗</a>}
                  </span>
                </div>
                {p.description && <p className="resume-shell-p">{p.description}</p>}
                {(p.techStack?.length > 0) && (
                  <div className="resume-shell-tech-pills">
                    {p.techStack.map((t, j) => (
                      <span key={j} className="resume-shell-tech-pill">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {(links?.github || links?.linkedin) && (
        <section className="resume-shell-section">
          <h2 className="resume-shell-h2">Links</h2>
          <p className="resume-shell-p">
            {[links.github, links.linkedin].filter(Boolean).join(' · ')}
          </p>
        </section>
      )}

      {!personal?.name && !summary && !education?.length && !experience?.length && !projects?.length && !hasAnySkill && (
        <p className="resume-shell-empty">Fill the form to see your resume here.</p>
      )}
    </>
  );

  const isModern = template === 'modern';

  return (
    <div
      className={`resume-preview-shell ${templateClass}`}
      style={{ '--resume-accent': accentHsl }}
    >
      {isModern ? (
        <div className="resume-shell-modern-wrap">
          <aside className="resume-shell-sidebar">
            {headerBlock}
            {skillsBlock}
          </aside>
          <div className="resume-shell-main">{mainContent}</div>
        </div>
      ) : (
        <>
          {headerBlock}
          {mainContent}
          {skillsBlock}
        </>
      )}
    </div>
  );
}
