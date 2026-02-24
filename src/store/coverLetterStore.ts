import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersonalInfo } from './resumeStore';

export interface CoverLetterData {
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderLocation: string;
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  date: string;
  jobTitle: string;
  salutation: string;
  opening: string;
  body: string;
  closing: string;
  signOff: string;
  pageSize: 'LETTER' | 'A4';
}

interface CoverLetterStore {
  data: CoverLetterData;
  templateId: string;
  setTemplate: (id: string) => void;
  updateField: (field: keyof CoverLetterData, value: string) => void;
  syncFromResume: (personal: PersonalInfo) => void;
  setPageSize: (size: 'LETTER' | 'A4') => void;
  loadSampleData: () => void;
  resetData: () => void;
}

const defaultData: CoverLetterData = {
  senderName: '',
  senderEmail: '',
  senderPhone: '',
  senderLocation: '',
  recipientName: '',
  recipientTitle: '',
  companyName: '',
  date: '',
  jobTitle: '',
  salutation: '',
  opening: '',
  body: '',
  closing: '',
  signOff: '',
  pageSize: 'LETTER',
};

const sampleData: CoverLetterData = {
  senderName: 'Alex Rivera',
  senderEmail: 'alex@email.com',
  senderPhone: '(415) 555-0192',
  senderLocation: 'San Francisco, CA',
  recipientName: 'Sarah Chen',
  recipientTitle: 'Engineering Manager',
  companyName: 'Stripe',
  date: 'February 24, 2026',
  jobTitle: 'Senior Software Engineer',
  salutation: 'Dear Sarah Chen,',
  opening: 'I am writing to express my strong interest in the Senior Software Engineer position at Stripe. With six years of experience building high-scale payment infrastructure and a deep passion for developer tooling, I believe I would be a great fit for your team.',
  body: 'In my current role at Linear, I owned the real-time sync engine powering collaborative editing across web and desktop — reducing initial page load by 60% through strategic code splitting and service worker caching. Before that, I built fraud detection dashboards at Stripe used by over 50,000 merchants. I thrive at the intersection of performance, reliability, and clean API design.',
  closing: 'I would love the opportunity to bring this experience to Stripe and help build the financial infrastructure of the internet. I am available for a conversation at your convenience, and I look forward to hearing from you.',
  signOff: 'Best regards,',
  pageSize: 'LETTER',
};

export const useCoverLetterStore = create<CoverLetterStore>()(
  persist(
    (set) => ({
      data: defaultData,
      templateId: 'classic',
      setTemplate: (templateId) => set({ templateId }),

      updateField: (field, value) =>
        set((s) => ({ data: { ...s.data, [field]: value } })),

      syncFromResume: (personal) =>
        set((s) => ({
          data: {
            ...s.data,
            senderName: personal.name || s.data.senderName,
            senderEmail: personal.email || s.data.senderEmail,
            senderPhone: personal.phone || s.data.senderPhone,
            senderLocation: personal.location || s.data.senderLocation,
          },
        })),

      setPageSize: (pageSize) =>
        set((s) => ({ data: { ...s.data, pageSize } })),

      loadSampleData: () => set({ data: sampleData }),
      resetData: () => set({ data: defaultData }),
    }),
    {
      name: 'cover-letter-data',
    }
  )
);
