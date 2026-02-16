/**
 * Project: { title, description, techStack: [], liveUrl: '', githubUrl: '' }
 * Legacy: { name, description, link } -> title, description, liveUrl, techStack: [], githubUrl: ''
 */

export const defaultProject = {
  title: '',
  description: '',
  techStack: [],
  liveUrl: '',
  githubUrl: '',
};

export function normalizeProject(p) {
  if (!p) return { ...defaultProject };
  if (p.title !== undefined && Array.isArray(p.techStack)) {
    return {
      title: p.title ?? '',
      description: p.description ?? '',
      techStack: [...(p.techStack || [])],
      liveUrl: p.liveUrl ?? '',
      githubUrl: p.githubUrl ?? '',
    };
  }
  return {
    title: p.name ?? p.title ?? '',
    description: p.description ?? '',
    techStack: [],
    liveUrl: p.link ?? p.liveUrl ?? '',
    githubUrl: p.githubUrl ?? '',
  };
}

export function normalizeProjects(projects) {
  if (!Array.isArray(projects)) return [];
  return projects.map(normalizeProject);
}
