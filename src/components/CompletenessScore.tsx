'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';
import type { ResumeData } from '@/store/resumeStore';

function calc(d: ResumeData): number {
  let s = 0;
  if (d.personal.name) s += 12;
  if (d.personal.title) s += 6;
  if (d.personal.email) s += 7;
  if (d.personal.phone) s += 4;
  if (d.personal.linkedin || d.personal.website) s += 4;
  if (d.summary) s += 10;
  if (d.experience.length > 0) s += 18;
  if (d.experience.some((e) => e.bullets.some((b) => b.trim()))) s += 9;
  if (d.education.length > 0) s += 10;
  if (d.skills) s += 10;
  if (d.projects.length > 0 || d.certifications.length > 0) s += 10;
  return Math.min(100, s);
}

export default function CompletenessScore() {
  const data = useResumeStore((s) => s.data);
  const { t } = useI18n();
  const score = calc(data);

  let text: string;
  let bar: string;
  if (score < 35) { text = t.completeness.justStarted; bar = 'bg-zinc-400'; }
  else if (score < 60) { text = t.completeness.gettingThere; bar = 'bg-amber-500'; }
  else if (score < 85) { text = t.completeness.lookingGood; bar = 'bg-lime-500'; }
  else { text = t.completeness.strong; bar = 'bg-lime-400'; }

  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="w-16 h-1 bg-zinc-900/5 rounded-full overflow-hidden flex-shrink-0">
        <div
          className={`h-full rounded-full transition-all duration-500 ${bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-[11px] text-zinc-400 whitespace-nowrap tabular-nums">
        {score}% · {text}
      </span>
    </div>
  );
}
