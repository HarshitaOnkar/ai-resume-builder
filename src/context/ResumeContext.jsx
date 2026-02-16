import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { loadResumeData, saveResumeData } from '../lib/resumeStorage';
import { defaultSkills, normalizeSkills, SUGGESTED_SKILLS } from '../lib/skillsShape';
import { defaultProject, normalizeProject, normalizeProjects } from '../lib/projectsShape';

const defaultPersonal = { name: '', email: '', phone: '', location: '' };
const defaultLinks = { github: '', linkedin: '' };

export const initialResume = {
  personal: { ...defaultPersonal },
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: { ...defaultSkills },
  links: { ...defaultLinks },
};

export const sampleResume = {
  personal: {
    name: 'Jordan Chen',
    email: 'jordan.chen@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
  },
  summary: 'Full-stack engineer with 5+ years building scalable web applications. Focus on React, Node.js, and cloud infrastructure. Passionate about clean code and user experience.',
  education: [
    { school: 'Stanford University', degree: 'B.S. Computer Science', dates: '2015 – 2019', details: 'Relevant coursework: Algorithms, Distributed Systems.' },
    { school: 'Online Certifications', degree: 'AWS Solutions Architect', dates: '2020', details: '' },
  ],
  experience: [
    { company: 'Tech Corp', role: 'Senior Software Engineer', dates: '2021 – Present', details: 'Lead development of customer dashboard. Reduced load time by 40%. Mentored 3 junior engineers.' },
    { company: 'Startup Inc', role: 'Software Engineer', dates: '2019 – 2021', details: 'Built REST APIs and React frontends. Collaborated with design and product teams.' },
  ],
  projects: [
    { title: 'Open Source CLI Tool', description: 'Developer tool with 2k+ GitHub stars. Used by 50+ companies.', techStack: ['Node.js', 'TypeScript'], liveUrl: '', githubUrl: '' },
    { title: 'Portfolio Site', description: 'Personal site with blog and project showcase. Next.js, MDX.', techStack: ['Next.js', 'React'], liveUrl: '', githubUrl: '' },
  ],
  skills: {
    technical: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL'],
    soft: ['Communication', 'Collaboration'],
    tools: ['AWS', 'Docker', 'Git', 'CI/CD'],
  },
  links: { github: 'https://github.com/jordanchen', linkedin: 'https://linkedin.com/in/jordanchen' },
};

function mergeWithInitial(loaded) {
  if (!loaded || typeof loaded !== 'object') return null;
  return {
    personal: { ...defaultPersonal, ...(loaded.personal || {}) },
    summary: typeof loaded.summary === 'string' ? loaded.summary : '',
    education: Array.isArray(loaded.education) ? loaded.education : [],
    experience: Array.isArray(loaded.experience) ? loaded.experience : [],
    projects: normalizeProjects(loaded.projects),
    skills: normalizeSkills(loaded.skills),
    links: { ...defaultLinks, ...(loaded.links || {}) },
  };
}

const ResumeContext = createContext(null);

export function ResumeProvider({ children }) {
  const [resume, setResume] = useState(() => {
    const loaded = loadResumeData();
    const merged = mergeWithInitial(loaded);
    return merged || JSON.parse(JSON.stringify(initialResume));
  });
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveResumeData(resume);
      saveTimeoutRef.current = null;
    }, 300);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [resume]);

  const updatePersonal = useCallback((field, value) => {
    setResume((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  }, []);

  const updateSummary = useCallback((value) => {
    setResume((prev) => ({ ...prev, summary: value }));
  }, []);

  const updateEducation = useCallback((index, entry) => {
    setResume((prev) => {
      const next = [...(prev.education || [])];
      next[index] = entry;
      return { ...prev, education: next };
    });
  }, []);

  const addEducation = useCallback(() => {
    setResume((prev) => ({
      ...prev,
      education: [...(prev.education || []), { school: '', degree: '', dates: '', details: '' }],
    }));
  }, []);

  const removeEducation = useCallback((index) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  }, []);

  const updateExperience = useCallback((index, entry) => {
    setResume((prev) => {
      const next = [...(prev.experience || [])];
      next[index] = entry;
      return { ...prev, experience: next };
    });
  }, []);

  const addExperience = useCallback(() => {
    setResume((prev) => ({
      ...prev,
      experience: [...(prev.experience || []), { company: '', role: '', dates: '', details: '' }],
    }));
  }, []);

  const removeExperience = useCallback((index) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  }, []);

  const updateProject = useCallback((index, entry) => {
    setResume((prev) => {
      const next = [...(prev.projects || [])];
      next[index] = entry;
      return { ...prev, projects: next };
    });
  }, []);

  const addProject = useCallback(() => {
    setResume((prev) => ({
      ...prev,
      projects: [...(prev.projects || []), { ...defaultProject }],
    }));
  }, []);

  const removeProject = useCallback((index) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  }, []);

  const updateSkills = useCallback((value) => {
    setResume((prev) => ({ ...prev, skills: typeof value === 'string' ? normalizeSkills(value) : value }));
  }, []);

  const addSkillToCategory = useCallback((category, skill) => {
    const trimmed = (skill || '').trim();
    if (!trimmed) return;
    setResume((prev) => {
      const s = normalizeSkills(prev.skills);
      const list = [...(s[category] || [])];
      if (list.includes(trimmed)) return prev;
      list.push(trimmed);
      return { ...prev, skills: { ...s, [category]: list } };
    });
  }, []);

  const removeSkillFromCategory = useCallback((category, index) => {
    setResume((prev) => {
      const s = normalizeSkills(prev.skills);
      const list = [...(s[category] || [])];
      list.splice(index, 1);
      return { ...prev, skills: { ...s, [category]: list } };
    });
  }, []);

  const suggestSkills = useCallback(() => {
    setResume((prev) => {
      const s = normalizeSkills(prev.skills);
      const add = (cat, items) => {
        const existing = new Set(s[cat] || []);
        items.forEach((item) => existing.add(item));
        return Array.from(existing);
      };
      return {
        ...prev,
        skills: {
          technical: add('technical', SUGGESTED_SKILLS.technical),
          soft: add('soft', SUGGESTED_SKILLS.soft),
          tools: add('tools', SUGGESTED_SKILLS.tools),
        },
      };
    });
  }, []);

  const updateLinks = useCallback((field, value) => {
    setResume((prev) => ({
      ...prev,
      links: { ...prev.links, [field]: value },
    }));
  }, []);

  const loadSampleData = useCallback(() => {
    setResume(JSON.parse(JSON.stringify(sampleResume)));
  }, []);

  const resetResume = useCallback(() => {
    setResume(JSON.parse(JSON.stringify(initialResume)));
  }, []);

  const value = {
    resume,
    updatePersonal,
    updateSummary,
    education: resume.education || [],
    experience: resume.experience || [],
    projects: Array.isArray(resume.projects) ? resume.projects.map((p) => ({ ...defaultProject, ...normalizeProject(p) })) : [],
    updateEducation,
    addEducation,
    removeEducation,
    updateExperience,
    addExperience,
    removeExperience,
    updateProject,
    addProject,
    removeProject,
    updateSkills,
    addSkillToCategory,
    removeSkillFromCategory,
    suggestSkills,
    updateLinks,
    loadSampleData,
    resetResume,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
}
