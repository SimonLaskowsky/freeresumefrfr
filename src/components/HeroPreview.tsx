'use client';

import { useState } from 'react';

const W = 595;
const H = 842;
const SCALE = 0.5;
const OW = Math.round(W * SCALE); // 298
const OH = Math.round(H * SCALE); // 421

const TEMPLATES = [
  { id: 'classic',   label: 'Classic',   accent: '#1a2744' },
  { id: 'modern',    label: 'Modern',    accent: '#0891b2' },
  { id: 'minimal',   label: 'Minimal',   accent: '#18181b' },
  { id: 'bold',      label: 'Bold',      accent: '#a3e635' },
  { id: 'executive', label: 'Executive', accent: '#7c3aed' },
];

function Bar({ w = '100%', h = 9, color = '#e5e7eb', mb = 0 }: { w?: string | number; h?: number; color?: string; mb?: number }) {
  return <div style={{ width: w, height: h, backgroundColor: color, borderRadius: 2, marginBottom: mb }} />;
}

function ClassicMock({ accent }: { accent: string }) {
  return (
    <div style={{ width: W, height: H, backgroundColor: '#ffffff', padding: '42px 52px', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Alex Johnson</div>
      <div style={{ fontSize: 13, color: '#555', marginBottom: 6 }}>Product Designer · UX Researcher</div>
      <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#888', marginBottom: 18 }}>
        <span>alex@email.com</span><span>·</span><span>New York, NY</span><span>·</span><span>linkedin.com/in/alex</span>
      </div>

      <div style={{ borderBottom: `2px solid ${accent}`, marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: accent, paddingBottom: 4 }}>Experience</div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>Senior Product Designer</div>
          <div style={{ fontSize: 11, color: '#888' }}>2021 - Present</div>
        </div>
        <div style={{ fontSize: 11, color: '#555', marginBottom: 7 }}>Figma Inc., New York</div>
        <Bar w="92%" color="#d1d5db" h={8} mb={4} /><Bar w="84%" color="#d1d5db" h={8} mb={4} /><Bar w="76%" color="#d1d5db" h={8} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>UX Designer</div>
          <div style={{ fontSize: 11, color: '#888' }}>2019 - 2021</div>
        </div>
        <div style={{ fontSize: 11, color: '#555', marginBottom: 7 }}>Stripe, San Francisco</div>
        <Bar w="88%" color="#d1d5db" h={8} mb={4} /><Bar w="74%" color="#d1d5db" h={8} />
      </div>

      <div style={{ borderBottom: `2px solid ${accent}`, marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: accent, paddingBottom: 4 }}>Education</div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>B.S. Design, MIT</div>
          <div style={{ fontSize: 11, color: '#888' }}>2015 - 2019</div>
        </div>
      </div>

      <div style={{ borderBottom: `2px solid ${accent}`, marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: accent, paddingBottom: 4 }}>Skills</div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
        {['Figma', 'Sketch', 'Prototyping', 'User Research', 'TypeScript', 'React'].map(s => (
          <div key={s} style={{ padding: '4px 10px', backgroundColor: '#f3f4f6', borderRadius: 4, fontSize: 11, color: '#374151' }}>{s}</div>
        ))}
      </div>
    </div>
  );
}

function ModernMock({ accent }: { accent: string }) {
  return (
    <div style={{ width: W, height: H, display: 'flex', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      <div style={{ width: 178, backgroundColor: accent, padding: '36px 18px', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4, lineHeight: 1.2 }}>Alex Johnson</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 22, fontStyle: 'italic' as const }}>Product Designer</div>
        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase' as const, marginBottom: 8 }}>Contact</div>
        <Bar w="80%" color="rgba(255,255,255,0.25)" h={7} mb={5} />
        <Bar w="70%" color="rgba(255,255,255,0.25)" h={7} mb={5} />
        <Bar w="85%" color="rgba(255,255,255,0.25)" h={7} mb={22} />
        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase' as const, marginBottom: 10 }}>Skills</div>
        {['Figma', 'React', 'TypeScript', 'UX Research', 'Prototyping'].map(s => (
          <div key={s} style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.85)', marginBottom: 7 }}>· {s}</div>
        ))}
      </div>
      <div style={{ flex: 1, padding: '36px 26px', backgroundColor: '#ffffff', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' as const, color: '#374151', marginBottom: 4 }}>Experience</div>
        <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: 12 }} />
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>Senior Designer</div>
            <div style={{ fontSize: 10, color: '#9ca3af' }}>2021-Now</div>
          </div>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>Figma Inc.</div>
          <Bar w="95%" color="#e5e7eb" h={8} mb={4} /><Bar w="85%" color="#e5e7eb" h={8} mb={4} /><Bar w="74%" color="#e5e7eb" h={8} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>UX Designer</div>
            <div style={{ fontSize: 10, color: '#9ca3af' }}>2019-2021</div>
          </div>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>Stripe</div>
          <Bar w="90%" color="#e5e7eb" h={8} mb={4} /><Bar w="78%" color="#e5e7eb" h={8} />
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' as const, color: '#374151', marginBottom: 4 }}>Education</div>
        <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: 10 }} />
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 3 }}>B.S. Design · MIT</div>
        <div style={{ fontSize: 11, color: '#6b7280' }}>2015 - 2019</div>
      </div>
    </div>
  );
}

function MinimalMock({ accent }: { accent: string }) {
  return (
    <div style={{ width: W, height: H, backgroundColor: '#ffffff', padding: '52px 64px', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      <div style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginBottom: 5 }}>Alex Johnson</div>
      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Product Designer</div>
      <div style={{ display: 'flex', gap: 20, fontSize: 11, color: '#94a3b8', marginBottom: 28, borderBottom: '0.5px solid #e2e8f0', paddingBottom: 16 }}>
        <span>alex@email.com</span><span>New York, NY</span><span>linkedin.com</span>
      </div>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase' as const, marginBottom: 12, color: accent }}>Experience</div>
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>Senior Product Designer</div>
          <div style={{ fontSize: 11, color: '#9ca3af', fontStyle: 'italic' as const }}>2021 - Present</div>
        </div>
        <div style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic' as const, marginBottom: 8 }}>Figma Inc.</div>
        <Bar w="92%" color="#e2e8f0" h={8} mb={5} /><Bar w="82%" color="#e2e8f0" h={8} mb={5} /><Bar w="70%" color="#e2e8f0" h={8} />
      </div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>UX Designer</div>
          <div style={{ fontSize: 11, color: '#9ca3af', fontStyle: 'italic' as const }}>2019 - 2021</div>
        </div>
        <div style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic' as const, marginBottom: 8 }}>Stripe</div>
        <Bar w="88%" color="#e2e8f0" h={8} mb={5} /><Bar w="76%" color="#e2e8f0" h={8} />
      </div>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase' as const, marginBottom: 12, color: accent }}>Skills</div>
      <Bar w="96%" color="#e2e8f0" h={9} mb={5} /><Bar w="80%" color="#e2e8f0" h={9} />
    </div>
  );
}

function BoldMock({ accent }: { accent: string }) {
  return (
    <div style={{ width: W, height: H, backgroundColor: '#18181b', padding: '44px 52px', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      <div style={{ fontSize: 30, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>Alex Johnson</div>
      <div style={{ fontSize: 14, color: accent, marginBottom: 14 }}>Product Designer</div>
      <div style={{ height: 1, backgroundColor: '#3f3f46', marginBottom: 22 }} />
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: accent, marginBottom: 10 }}>Experience</div>
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Senior Designer</div>
          <div style={{ fontSize: 11, color: '#71717a' }}>2021 - Now</div>
        </div>
        <div style={{ fontSize: 11, color: '#a1a1aa', marginBottom: 8 }}>Figma Inc.</div>
        <Bar w="92%" color="#3f3f46" h={8} mb={5} /><Bar w="80%" color="#3f3f46" h={8} mb={5} /><Bar w="68%" color="#3f3f46" h={8} />
      </div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>UX Designer</div>
          <div style={{ fontSize: 11, color: '#71717a' }}>2019 - 2021</div>
        </div>
        <div style={{ fontSize: 11, color: '#a1a1aa', marginBottom: 8 }}>Stripe</div>
        <Bar w="86%" color="#3f3f46" h={8} mb={5} /><Bar w="74%" color="#3f3f46" h={8} />
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: accent, marginBottom: 12 }}>Skills</div>
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
        {['Figma', 'React', 'TypeScript', 'UX Research'].map(s => (
          <div key={s} style={{ padding: '4px 10px', border: `1px solid ${accent}50`, borderRadius: 4, fontSize: 11, color: '#d4d4d8' }}>{s}</div>
        ))}
      </div>
    </div>
  );
}

function ExecutiveMock({ accent }: { accent: string }) {
  return (
    <div style={{ width: W, height: H, display: 'flex', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      <div style={{ width: 190, backgroundColor: accent, padding: '40px 20px', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4, lineHeight: 1.2 }}>Alex Johnson</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 28, fontStyle: 'italic' as const }}>Product Designer</div>
        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' as const, marginBottom: 8 }}>Contact</div>
        <Bar w="75%" color="rgba(255,255,255,0.2)" h={7} mb={5} />
        <Bar w="82%" color="rgba(255,255,255,0.2)" h={7} mb={5} />
        <Bar w="68%" color="rgba(255,255,255,0.2)" h={7} mb={26} />
        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' as const, marginBottom: 12 }}>Skills</div>
        {['Figma', 'React', 'UX Research', 'TypeScript', 'Prototyping'].map(s => (
          <div key={s} style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.85)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 4, height: 4, backgroundColor: 'rgba(255,255,255,0.45)', borderRadius: '50%', flexShrink: 0 }} />
            {s}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: '40px 28px', backgroundColor: '#ffffff', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' as const, color: accent, marginBottom: 4 }}>Experience</div>
        <div style={{ borderBottom: `1.5px solid ${accent}`, marginBottom: 12 }} />
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>Senior Designer</div>
            <div style={{ fontSize: 10, color: '#9ca3af' }}>2021-Now</div>
          </div>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 7 }}>Figma Inc.</div>
          <Bar w="94%" color="#e5e7eb" h={8} mb={4} /><Bar w="84%" color="#e5e7eb" h={8} mb={4} /><Bar w="72%" color="#e5e7eb" h={8} />
        </div>
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>UX Designer</div>
            <div style={{ fontSize: 10, color: '#9ca3af' }}>2019-2021</div>
          </div>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 7 }}>Stripe</div>
          <Bar w="88%" color="#e5e7eb" h={8} mb={4} /><Bar w="76%" color="#e5e7eb" h={8} />
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' as const, color: accent, marginBottom: 4 }}>Education</div>
        <div style={{ borderBottom: `1.5px solid ${accent}`, marginBottom: 10 }} />
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 3 }}>B.S. Design · MIT</div>
        <div style={{ fontSize: 11, color: '#6b7280' }}>2015 - 2019</div>
      </div>
    </div>
  );
}

const MOCKS: Record<string, (props: { accent: string }) => React.ReactNode> = {
  classic:   (p) => <ClassicMock {...p} />,
  modern:    (p) => <ModernMock {...p} />,
  minimal:   (p) => <MinimalMock {...p} />,
  bold:      (p) => <BoldMock {...p} />,
  executive: (p) => <ExecutiveMock {...p} />,
};

export function HeroPreview() {
  const [active, setActive] = useState('classic');
  const tpl = TEMPLATES.find(t => t.id === active)!;

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Floating resume card */}
      <div
        className="animate-float relative"
        style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6)) drop-shadow(0 0 40px rgba(163,230,53,0.06))' }}
      >
        <div style={{ width: OW, height: OH, overflow: 'hidden', borderRadius: 3, position: 'relative' }}>
          <div style={{ width: W, height: H, transform: `scale(${SCALE})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}>
            {MOCKS[active]?.({ accent: tpl.accent })}
          </div>
        </div>
        {/* Fade out at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: 100, background: 'linear-gradient(to bottom, transparent, rgb(9,9,11))' }}
        />
      </div>

      {/* Template switcher */}
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex items-center gap-3">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              title={t.label}
              style={{ backgroundColor: t.accent }}
              className={`w-5 h-5 rounded-full transition-all duration-150 cursor-pointer ${
                active === t.id
                  ? 'scale-125 ring-2 ring-offset-2 ring-offset-zinc-950 ring-white/40'
                  : 'opacity-40 hover:opacity-75 hover:scale-110'
              }`}
            />
          ))}
        </div>
        <span className="text-[11px] text-zinc-500">{tpl.label}</span>
      </div>
    </div>
  );
}
