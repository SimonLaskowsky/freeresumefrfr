'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';
import SectionWrapper from './SectionWrapper';
import BulletList from './BulletList';
import { inputCls } from './shared';

export default function ProjectsForm() {
  const { data, addProject, updateProject, removeProject } = useResumeStore();
  const { t } = useI18n();

  return (
    <SectionWrapper
      title={t.sections.projects}
      icon="⬡"
      count={data.projects.length}
      tip="Great for devs and career changers. Include a live URL or GitHub link. Lead highlights with the tech stack and quantify impact where possible."
      action={
        <button
          onClick={addProject}
          className="text-xs font-semibold text-lime-400 hover:text-lime-300 transition-colors flex items-center gap-1"
        >
          <span className="text-base leading-none">+</span> {t.actions.addProject.replace('+ ', '')}
        </button>
      }
    >
      {data.projects.length === 0 && (
        <p className="text-xs text-zinc-600 italic">No projects yet.</p>
      )}
      <div className="space-y-4">
        {data.projects.map((proj, i) => (
          <div key={proj.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Project {i + 1}</span>
              <button
                onClick={() => removeProject(proj.id)}
                className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
              >
                {t.actions.removeProject}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                className={inputCls}
                placeholder={t.fields.projectName}
                value={proj.name}
                onChange={(e) => updateProject(proj.id, { name: e.target.value })}
              />
              <input
                className={inputCls}
                placeholder={t.fields.url}
                value={proj.url}
                onChange={(e) => updateProject(proj.id, { url: e.target.value })}
              />
            </div>
            <input
              className={inputCls}
              placeholder={t.fields.description}
              value={proj.description}
              onChange={(e) => updateProject(proj.id, { description: e.target.value })}
            />
            <div>
              <p className="text-[11px] text-zinc-600 mb-2">Highlights — Enter to add more</p>
              <BulletList
                bullets={proj.bullets}
                onChange={(bullets) => updateProject(proj.id, { bullets })}
                placeholder={t.fields.bulletPlaceholder}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
