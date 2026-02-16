/**
 * Plain-text resume for copy-to-clipboard.
 * Sections: Name, Contact, Summary, Education, Experience, Projects, Skills, Links.
 */

function line(str) {
  return str ? String(str).trim() : '';
}

function section(title, body) {
  if (!body || (Array.isArray(body) && body.length === 0)) return '';
  const b = Array.isArray(body) ? body.join('\n') : line(body);
  return b ? `${title}\n${b}\n` : '';
}

export function resumeToPlainText(resume) {
  if (!resume) return '';

  const { personal, summary, education, experience, projects, skills, links } = resume;
  const out = [];

  out.push('Name');
  out.push(line(personal?.name) || '');
  out.push('');
  out.push('Contact');
  const contact = [personal?.email, personal?.phone, personal?.location].filter(Boolean).join(' · ');
  out.push(contact || '');
  out.push('');

  out.push('Summary');
  out.push(line(summary) || '');
  out.push('');

  out.push('Education');
  if (education?.length) {
    education.forEach((e) => {
      out.push(line(e.school) || '');
      if (e.degree) out.push(line(e.degree));
      if (e.dates) out.push(line(e.dates));
      if (e.details) out.push(line(e.details));
      out.push('');
    });
  } else {
    out.push('');
  }

  out.push('Experience');
  if (experience?.length) {
    experience.forEach((e) => {
      out.push(line(e.company) || '');
      if (e.role) out.push(line(e.role));
      if (e.dates) out.push(line(e.dates));
      if (e.details) out.push(line(e.details));
      out.push('');
    });
  } else {
    out.push('');
  }

  out.push('Projects');
  if (projects?.length) {
    projects.forEach((e) => {
      const title = line(e.title ?? e.name) || '';
      out.push(title);
      if (e.description) out.push(line(e.description));
      if (e.techStack?.length) out.push((e.techStack || []).join(', '));
      if (e.liveUrl) out.push(line(e.liveUrl));
      if (e.githubUrl) out.push(line(e.githubUrl));
      if (e.link && !e.liveUrl) out.push(line(e.link));
      out.push('');
    });
  } else {
    out.push('');
  }

  out.push('Skills');
  const skillList = [];
  if (skills && typeof skills === 'object') {
    skillList.push(...(skills.technical || []), ...(skills.soft || []), ...(skills.tools || []));
  } else if (typeof skills === 'string') {
    skillList.push(...skills.split(',').map((s) => s.trim()).filter(Boolean));
  }
  out.push(skillList.join(', ') || '');
  out.push('');

  out.push('Links');
  if (links?.github) out.push(line(links.github));
  if (links?.linkedin) out.push(line(links.linkedin));
  if (!links?.github && !links?.linkedin) out.push('');

  return out.join('\n').trimEnd();
}

/**
 * Returns true if resume may look incomplete: missing name or (no project and no experience).
 * Used to show a calm warning only; does not block export.
 */
export function isResumeIncomplete(resume) {
  if (!resume) return true;
  const hasName = !!(resume.personal?.name || '').trim();
  const hasProject = (resume.projects || []).length > 0;
  const hasExperience = (resume.experience || []).length > 0;
  if (!hasName) return true;
  if (!hasProject && !hasExperience) return true;
  return false;
}
