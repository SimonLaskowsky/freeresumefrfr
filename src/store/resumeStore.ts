import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  notes: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  bullets: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  skills: string;
  pageSize: 'LETTER' | 'A4';
}

interface ResumeStore {
  data: ResumeData;
  templateId: string;
  setTemplate: (id: string) => void;
  updatePersonal: (updates: Partial<PersonalInfo>) => void;
  updateSummary: (summary: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, updates: Partial<Omit<Experience, 'id'>>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, updates: Partial<Omit<Education, 'id'>>) => void;
  removeEducation: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, updates: Partial<Omit<Project, 'id'>>) => void;
  removeProject: (id: string) => void;
  addCertification: () => void;
  updateCertification: (id: string, updates: Partial<Omit<Certification, 'id'>>) => void;
  removeCertification: (id: string) => void;
  updateSkills: (skills: string) => void;
  setPageSize: (size: 'LETTER' | 'A4') => void;
  loadSampleData: () => void;
  resetData: () => void;
}

const defaultData: ResumeData = {
  personal: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', website: '' },
  summary: '',
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  skills: '',
  pageSize: 'LETTER',
};

export const sampleData: ResumeData = {
  personal: {
    name: 'Alex Rivera',
    title: 'Senior Software Engineer',
    email: 'alex@email.com',
    phone: '(415) 555-0192',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexrivera',
    website: 'alexrivera.dev',
  },
  summary: 'Full-stack engineer with 6 years building products used by millions. Obsessed with performance, clean APIs, and shipping things that matter. Previously at Stripe and Linear.',
  experience: [
    {
      id: 'sample-exp-1',
      title: 'Senior Software Engineer',
      company: 'Stripe',
      startDate: 'Jan 2022',
      endDate: '',
      current: true,
      bullets: [
        'Led migration of payment pipeline to event-driven architecture, cutting latency by 40%',
        'Built the Radar fraud detection dashboard used by 50k+ merchants',
        'Mentored 4 junior engineers and established team-wide code review standards',
      ],
    },
    {
      id: 'sample-exp-2',
      title: 'Software Engineer',
      company: 'Linear',
      startDate: 'Jun 2020',
      endDate: 'Dec 2021',
      current: false,
      bullets: [
        'Owned the realtime sync engine powering collaborative editing across web and desktop',
        'Reduced initial page load by 60% through code splitting and service worker caching',
      ],
    },
  ],
  education: [
    {
      id: 'sample-edu-1',
      degree: 'B.S. Computer Science',
      school: 'UC Berkeley',
      startDate: '2016',
      endDate: '2020',
      notes: "GPA 3.8 · Dean's List",
    },
  ],
  projects: [
    {
      id: 'sample-proj-1',
      name: 'openaudit',
      description: 'Open-source CLI for auditing npm dependencies',
      url: 'github.com/alexrivera/openaudit',
      bullets: [
        '800+ GitHub stars, adopted by teams at Vercel and Shopify',
        'Written in Rust for 10× faster scanning vs alternatives',
      ],
    },
  ],
  certifications: [
    {
      id: 'sample-cert-1',
      name: 'AWS Solutions Architect',
      issuer: 'Amazon',
      date: '2023',
    },
  ],
  skills: 'TypeScript, React, Node.js, Rust, PostgreSQL, Redis, Kafka, AWS, Docker, Kubernetes',
  pageSize: 'LETTER',
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      data: defaultData,
      templateId: 'classic',
      setTemplate: (templateId) => set({ templateId }),

      updatePersonal: (updates) =>
        set((s) => ({ data: { ...s.data, personal: { ...s.data.personal, ...updates } } })),

      updateSummary: (summary) =>
        set((s) => ({ data: { ...s.data, summary } })),

      addExperience: () =>
        set((s) => ({
          data: {
            ...s.data,
            experience: [...s.data.experience, {
              id: crypto.randomUUID(), company: '', title: '',
              startDate: '', endDate: '', current: false, bullets: [''],
            }],
          },
        })),

      updateExperience: (id, updates) =>
        set((s) => ({
          data: {
            ...s.data,
            experience: s.data.experience.map((e) => e.id === id ? { ...e, ...updates } : e),
          },
        })),

      removeExperience: (id) =>
        set((s) => ({ data: { ...s.data, experience: s.data.experience.filter((e) => e.id !== id) } })),

      addEducation: () =>
        set((s) => ({
          data: {
            ...s.data,
            education: [...s.data.education, {
              id: crypto.randomUUID(), school: '', degree: '', startDate: '', endDate: '', notes: '',
            }],
          },
        })),

      updateEducation: (id, updates) =>
        set((s) => ({
          data: {
            ...s.data,
            education: s.data.education.map((e) => e.id === id ? { ...e, ...updates } : e),
          },
        })),

      removeEducation: (id) =>
        set((s) => ({ data: { ...s.data, education: s.data.education.filter((e) => e.id !== id) } })),

      addProject: () =>
        set((s) => ({
          data: {
            ...s.data,
            projects: [...s.data.projects, {
              id: crypto.randomUUID(), name: '', description: '', url: '', bullets: [''],
            }],
          },
        })),

      updateProject: (id, updates) =>
        set((s) => ({
          data: {
            ...s.data,
            projects: s.data.projects.map((p) => p.id === id ? { ...p, ...updates } : p),
          },
        })),

      removeProject: (id) =>
        set((s) => ({ data: { ...s.data, projects: s.data.projects.filter((p) => p.id !== id) } })),

      addCertification: () =>
        set((s) => ({
          data: {
            ...s.data,
            certifications: [...s.data.certifications, {
              id: crypto.randomUUID(), name: '', issuer: '', date: '',
            }],
          },
        })),

      updateCertification: (id, updates) =>
        set((s) => ({
          data: {
            ...s.data,
            certifications: s.data.certifications.map((c) => c.id === id ? { ...c, ...updates } : c),
          },
        })),

      removeCertification: (id) =>
        set((s) => ({
          data: { ...s.data, certifications: s.data.certifications.filter((c) => c.id !== id) },
        })),

      updateSkills: (skills) =>
        set((s) => ({ data: { ...s.data, skills } })),

      setPageSize: (pageSize) =>
        set((s) => ({ data: { ...s.data, pageSize } })),

      loadSampleData: () => set({ data: sampleData }),
      resetData: () => set({ data: defaultData }),
    }),
    {
      name: 'resume-data',
      version: 1,
      migrate: (raw: unknown, version: number) => {
        // v0 → v1: bullets was a string, now string[]
        const state = raw as { data?: Partial<ResumeData> & { experience?: Array<{ bullets: unknown }> } };
        if (version === 0 && state.data) {
          if (state.data.experience) {
            state.data.experience = state.data.experience.map((exp) => ({
              ...exp,
              bullets: typeof exp.bullets === 'string'
                ? (exp.bullets as string).split('\n').filter((b) => b.trim())
                : Array.isArray(exp.bullets) ? exp.bullets : [''],
            }));
          }
          state.data.summary ??= '';
          state.data.projects ??= [];
          state.data.certifications ??= [];
          state.data.pageSize ??= 'LETTER';
        }
        return state as { data: ResumeData; templateId: string };
      },
    }
  )
);
