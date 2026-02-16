/**
 * Skills: { technical: [], soft: [], tools: [] }
 * Legacy: comma-separated string -> technical, rest empty.
 */

export const SKILL_CATEGORIES = ['technical', 'soft', 'tools'];

export const defaultSkills = {
  technical: [],
  soft: [],
  tools: [],
};

export function normalizeSkills(skills) {
  if (!skills) return { ...defaultSkills };
  if (typeof skills === 'object' && Array.isArray(skills.technical)) {
    return {
      technical: [...(skills.technical || [])],
      soft: [...(skills.soft || [])],
      tools: [...(skills.tools || [])],
    };
  }
  if (typeof skills === 'string') {
    const list = skills.split(',').map((s) => s.trim()).filter(Boolean);
    return { technical: list, soft: [], tools: [] };
  }
  return { ...defaultSkills };
}

export function totalSkillCount(skills) {
  const s = normalizeSkills(skills);
  return (s.technical?.length || 0) + (s.soft?.length || 0) + (s.tools?.length || 0);
}

export const SUGGESTED_SKILLS = {
  technical: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL'],
  soft: ['Team Leadership', 'Problem Solving'],
  tools: ['Git', 'Docker', 'AWS'],
};
