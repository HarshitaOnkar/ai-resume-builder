/**
 * ATS Score v2: deterministic 0–100, no AI.
 * +10 name, +10 email, +5 phone
 * +10 summary > 50 chars
 * +15 at least 1 experience with bullets
 * +10 at least 1 education
 * +10 at least 5 skills
 * +10 at least 1 project
 * +5 LinkedIn, +5 GitHub
 * +10 summary contains action verbs
 * Max 100.
 */

const ACTION_VERBS = [
  'built', 'led', 'designed', 'improved', 'created', 'managed', 'delivered',
  'achieved', 'developed', 'implemented', 'optimized', 'launched', 'established',
  'reduced', 'increased', 'coordinated', 'drove', 'automated',
];

function skillCount(skills) {
  if (skills == null) return 0;
  if (typeof skills === 'string') {
    return skills.split(',').map((s) => s.trim()).filter(Boolean).length;
  }
  if (typeof skills === 'object') {
    const t = skills.technical || [];
    const s = skills.soft || [];
    const o = skills.tools || [];
    return (Array.isArray(t) ? t.length : 0) + (Array.isArray(s) ? s.length : 0) + (Array.isArray(o) ? o.length : 0);
  }
  return 0;
}

function summaryHasActionVerbs(summary) {
  if (!summary || typeof summary !== 'string') return false;
  const lower = summary.toLowerCase();
  return ACTION_VERBS.some((verb) => lower.includes(verb));
}

function hasExperienceWithBullets(experience) {
  if (!Array.isArray(experience) || experience.length === 0) return false;
  return experience.some((e) => (e?.details || '').trim().length > 0);
}

export function computeATSScore(resume) {
  if (!resume) return { score: 0, breakdown: {}, suggestions: [] };

  let score = 0;
  const breakdown = {};

  const hasName = !!(resume.personal?.name || '').trim();
  if (hasName) { score += 10; breakdown.name = 10; } else breakdown.name = 0;

  const hasEmail = !!(resume.personal?.email || '').trim();
  if (hasEmail) { score += 10; breakdown.email = 10; } else breakdown.email = 0;

  const hasPhone = !!(resume.personal?.phone || '').trim();
  if (hasPhone) { score += 5; breakdown.phone = 5; } else breakdown.phone = 0;

  const summaryLen = (resume.summary || '').trim().length;
  if (summaryLen > 50) { score += 10; breakdown.summaryLength = 10; } else breakdown.summaryLength = 0;

  const hasExpBullets = hasExperienceWithBullets(resume.experience || []);
  if (hasExpBullets) { score += 15; breakdown.experience = 15; } else breakdown.experience = 0;

  const hasEducation = Array.isArray(resume.education) && resume.education.length > 0;
  if (hasEducation) { score += 10; breakdown.education = 10; } else breakdown.education = 0;

  const skillsNum = skillCount(resume.skills);
  if (skillsNum >= 5) { score += 10; breakdown.skills = 10; } else breakdown.skills = 0;

  const projectCount = (resume.projects || []).length;
  if (projectCount >= 1) { score += 10; breakdown.projects = 10; } else breakdown.projects = 0;

  const hasLinkedIn = !!(resume.links?.linkedin || '').trim();
  if (hasLinkedIn) { score += 5; breakdown.linkedin = 5; } else breakdown.linkedin = 0;

  const hasGitHub = !!(resume.links?.github || '').trim();
  if (hasGitHub) { score += 5; breakdown.github = 5; } else breakdown.github = 0;

  const summaryActions = summaryHasActionVerbs(resume.summary);
  if (summaryActions) { score += 10; breakdown.summaryVerbs = 10; } else breakdown.summaryVerbs = 0;

  const cappedScore = Math.min(100, score);

  const suggestions = [];
  if (!hasName) suggestions.push('Add your name (+10 points)');
  if (!hasEmail) suggestions.push('Add your email (+10 points)');
  if (!hasPhone) suggestions.push('Add your phone (+5 points)');
  if (summaryLen <= 50) suggestions.push('Add a professional summary over 50 characters (+10 points)');
  if (!hasExpBullets) suggestions.push('Add at least one experience entry with bullet points (+15 points)');
  if (!hasEducation) suggestions.push('Add at least one education entry (+10 points)');
  if (skillsNum < 5) suggestions.push('Add at least 5 skills (+10 points)');
  if (projectCount < 1) suggestions.push('Add at least one project (+10 points)');
  if (!hasLinkedIn) suggestions.push('Add your LinkedIn link (+5 points)');
  if (!hasGitHub) suggestions.push('Add your GitHub link (+5 points)');
  if (!summaryActions) suggestions.push('Use action verbs in your summary (e.g. built, led, designed) (+10 points)');

  return {
    score: cappedScore,
    breakdown,
    suggestions,
  };
}

/** Band for circular display: 0-40 Needs Work (red), 41-70 Getting There (amber), 71-100 Strong (green) */
export function getATSScoreBand(score) {
  if (score <= 40) return { label: 'Needs Work', theme: 'red' };
  if (score <= 70) return { label: 'Getting There', theme: 'amber' };
  return { label: 'Strong Resume', theme: 'green' };
}

/**
 * Top improvements for ImprovementPanel (uses same logic as computeATSScore suggestions).
 */
export function getTopImprovements(resume) {
  const { suggestions } = computeATSScore(resume);
  return suggestions.slice(0, 5);
}
