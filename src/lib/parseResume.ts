import type { ResumeData } from '../store/resumeStore';

/**
 * Heuristic resume parser. Order-independent by construction: it scans every
 * line for a known section heading and buckets content under whatever heading
 * was last seen, so sections can appear in any order and repeat.
 *
 * textFromPages() turns a PDF text layer into those lines and handles the one
 * layout that order independence cannot save us from: two columns.
 *
 * ponytail: everything here is a guess with a good hit rate, never a contract.
 * The import flow tells the user to check the fields, and the builder is the
 * fixup UI. Add vocabulary to the tables when a real resume misses, do not
 * grow a grammar.
 */

type Section = 'header' | 'summary' | 'experience' | 'education' | 'projects' | 'certifications' | 'languages' | 'skills';

const HEADINGS: Array<[Section, RegExp]> = [
  ['header', /^(contact|contact\s*details|personal\s*(info\w*|details)|kontakt|dane\s*(osobowe|kontaktowe)|contacto|contatti|kontakte?)\b/i],
  ['summary', /^(professional\s+|career\s+)?(summary|profile|objective|about\s*me|about|podsumowanie|profil|o\s*mnie|cel\s*zawodowy|resumen|perfil|profil\s*professionnel|à\s*propos|kurzprofil|zusammenfassung|über\s*mich|profilo|sobre\s*mim)\b/i],
  ['experience', /^(work\s+|working\s+|professional\s+|employment\s+|relevant\s+)?(experience|history|employment|career|doświadczenie(\s*zawodowe)?|zatrudnienie|praktyk\w*|kariera|experiencia(\s*laboral|\s*profesional)?|expérience(s)?(\s*professionnelle(s)?)?|berufserfahrung|erfahrung|werdegang|esperienza|experiência)\b/i],
  ['education', /^(education|academic\w*|qualifications|schooling|wykształcenie|edukacja|studia|szkoły|educación|formación|formation|éducation|ausbildung|bildung|studium|istruzione|formazione|educação)\b/i],
  ['projects', /^(side\s+|personal\s+|selected\s+)?(projects?|projekty|proyectos|projets|projekte|progetti|projetos)\b/i],
  ['certifications', /^(certifications?|certificates?|licen[sc]es?|courses?|training|awards?|certyfikaty|kursy|szkolenia|uprawnienia|nagrody|certificaciones|cursos|zertifikate|kurse|certificazioni|certificats)\b/i],
  ['languages', /^(languages?(\s*skills)?|języki(\s*obce)?|znajomość\s*języków|idiomas|langues|sprachen|lingue|idiomas)\b/i],
  ['skills', /^(technical\s+|core\s+|key\s+|hard\s+|soft\s+)?(skills|technologies|competenc\w+|expertise|tech\s*stack|toolbox|umiejętności|kompetencje|technologie|narzędzia|habilidades|competencias|compétences|kenntnisse|fähigkeiten|kompetenzen|competenze|conhecimentos|frameworks?i?|biblioteki|libraries|style|styles|cms|bazy\s*danych|databases|metodyki|methodologies)\b/i],
];

const BULLET = /^[•‣▪●○·⁃■∙»>*+\-–—]\s+/;
const PRESENT = /present|currently|current|to\s*date|now|today|ongoing|obecnie|aktualnie|nadal|teraz|dziś|actualidad|actual|présent|aujourd'hui|heute|jetzt|laufend|attuale|atual/i;
const MONTH = '(?:[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]{3,12}\\.?\\s*)?';
const YMD = `(?:\\d{1,2}[./]\\s*)?${MONTH}(?:19|20)\\d{2}`;
const RANGE = new RegExp(`(${YMD})\\s*(?:[-–—]|to\\b|do\\b|bis\\b|until\\b|au\\b|a\\b|–)\\s*(${YMD}|${PRESENT.source})`, 'i');
const SINGLE_DATE = new RegExp(YMD, 'i');
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+\w/;
const URL_SRC = '\\b((?:https?:\\/\\/|www\\.)[^\\s,;()<>]+|(?:[\\w-]+\\.)+(?:com|org|net|io|dev|me|co|pl|eu|app|xyz|ai|de|fr|es|it|uk)(?:\\/[^\\s,;()<>]*)?)';
const URL = new RegExp(URL_SRC, 'i');
const URL_G = new RegExp(URL_SRC, 'gi');
const PHONE = /(?:\+\d{1,3}[\s.-]?)?(?:\(\d{1,4}\)[\s.-]?)?\d[\d\s().-]{7,16}\d/;
const ROLE = /engineer|developer|programmer|manager|designer|analyst|consultant|specialist|director|lead\b|head\s+of|intern\b|architect|scientist|administrator|coordinator|assistant|officer|founder|freelanc|teacher|nurse|driver|technician|programist|inżynier|kierownik|specjalist|analityk|projektant|konsultant|stażyst|praktykant|dyrektor|handlow|sprzedaw|kelner|nauczyciel|technik|asystent|magazynier|kucharz|opiekun/i;
const DEGREE = /bachelor|master|\bb\.?\s?(sc|eng|s|a)\b|\bm\.?\s?(sc|eng|s|a)\b|ph\.?\s?d|mba|doctor|diploma|engineer|licencjat|inżynier|magister|technik|liceum|technikum|studia|licence|licenciatura|diplom|laurea/i;
const ORG = /\b(sp\.?\s*z\s*o\.?\s*o\.?|s\.\s?a\.|inc\b|llc\b|ltd\b|gmbh|corp\b|co\.|company|group|university|universit|uniwersytet|politechnika|akademia|szkoła|college|school|institute|instytut)\b/i;
const TECH_LINE = /^(tech(nolog\w+)?|stack|tools|skills|narzędzia|technologie)\s*[:\-–]\s*/i;

const uid = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
const strip = (s: string) => s.replace(BULLET, '').trim();
const SPLIT = /\s*[|·•‖]\s*|\s+[-–—]\s+|\s*,\s*|\s+@\s+|\s+\bat\b\s+|\s+\bw\b\s+/i;

const ENTRY_SECTIONS = new Set(['experience', 'projects', 'education']);

/** "D O Ś W I A D C Z E N I E" is a heading with letter spacing, not 13 words. */
function unspace(line: string): string {
  const tokens = line.split(/\s+/).filter(Boolean);
  if (tokens.length < 4) return line;
  const singles = tokens.filter((t) => t.length === 1).length;
  return singles / tokens.length >= 0.6 ? tokens.join('') : line;
}

function detectHeading(raw: string, cur: string): [Section, string] | null {
  const line = unspace(raw.trim().replace(/[:：]\s*$/, ''));
  if (!line || line.length > 60 || BULLET.test(raw.trim())) return null;
  for (const [section, re] of HEADINGS) {
    const m = line.match(re);
    if (!m || m.index !== 0) continue;
    const rest = line.slice(m[0].length).replace(/^[\s:–—-]+/, '');
    // A heading is a heading, not a sentence: allow a short trailing remainder
    // ("Languages: English, Polish") but reject prose that merely starts with one.
    if (rest.split(/\s+/).filter(Boolean).length > 8) return null;
    // "Technologies: Go, Kafka" inside a job entry is that job's tech list, not
    // the start of a skills section. A real skills heading stands alone.
    if (rest && section === 'skills' && ENTRY_SECTIONS.has(cur)) return null;
    return [section, rest];
  }
  return null;
}

function splitSections(lines: string[]) {
  const out: Record<string, string[]> = { header: [] };
  let cur = 'header';
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const hit = detectHeading(line, cur);
    if (hit) {
      cur = hit[0];
      out[cur] ??= [];
      if (hit[1]) out[cur].push(hit[1]);
      continue;
    }
    (out[cur] ??= []).push(line);
  }
  return out;
}

function takeDates(line: string): { start: string; end: string; current: boolean; rest: string } {
  const m = line.match(RANGE);
  if (m) {
    const end = m[2].trim();
    return {
      start: m[1].trim(),
      end: PRESENT.test(end) ? '' : end,
      current: PRESENT.test(end),
      rest: line.replace(m[0], ' ').trim(),
    };
  }
  const one = line.match(SINGLE_DATE);
  if (one) {
    const openEnded = new RegExp(`${YMD}\\s*[-–—]\\s*$`, 'i').test(line.trim()) || PRESENT.test(line);
    return { start: one[0].trim(), end: '', current: openEnded, rest: line.replace(one[0], ' ').replace(/[-–—]\s*$/, '').trim() };
  }
  return { start: '', end: '', current: false, rest: line };
}

const hasDate = (line: string) => RANGE.test(line) || SINGLE_DATE.test(line);

/** "(pełny etat, zdalnie)" qualifies the role, it is not a second field. */
const dropParens = (s: string) => s.replace(/\([^)]*\)/g, ' ').trim();

function parts(rest: string): string[] {
  return rest.split(SPLIT).map((p) => p.replace(/^[\s|·•,\-–—]+|[\s|·•,\-–—]+$/g, '')).filter(Boolean);
}

/** Split "Senior Engineer — Stripe" into role + org without knowing the order. */
function roleAndOrg(chunks: string[]): { role: string; org: string } {
  if (chunks.length === 0) return { role: '', org: '' };
  if (chunks.length === 1) {
    return ROLE.test(chunks[0]) || !ORG.test(chunks[0])
      ? { role: chunks[0], org: '' }
      : { role: '', org: chunks[0] };
  }
  const roleIdx = chunks.findIndex((c) => ROLE.test(c));
  const orgIdx = chunks.findIndex((c, i) => i !== roleIdx && ORG.test(c));
  if (roleIdx >= 0) {
    const rest = chunks.filter((_, i) => i !== roleIdx);
    return { role: chunks[roleIdx], org: (orgIdx >= 0 ? chunks[orgIdx] : rest[0]) ?? '' };
  }
  if (orgIdx >= 0) return { org: chunks[orgIdx], role: chunks.filter((_, i) => i !== orgIdx)[0] ?? '' };
  return { role: chunks[0], org: chunks[1] ?? '' };
}

interface RawEntry { head: string; lines: string[] }

/** Group a section's lines into entries. A dated non-bullet line starts a new one. */
function toEntries(lines: string[]): RawEntry[] {
  const entries: RawEntry[] = [];
  for (const raw of lines) {
    const isBullet = BULLET.test(raw);
    const startsEntry = !isBullet && hasDate(raw) && strip(raw).length < 120;
    const last = entries[entries.length - 1];
    // "Role, Company" on one line and the dates on the next: same entry.
    if (startsEntry && last && !last.lines.length && !hasDate(last.head)) last.head += ' | ' + raw;
    else if (startsEntry || entries.length === 0) entries.push({ head: raw, lines: [] });
    else entries[entries.length - 1].lines.push(raw);
  }
  return entries;
}

/** "Next.js · TypeScript · Tailwind" or "Blazor JavaScript HTML CSS": a tech row,
 *  not the tail of the bullet above it. Prose has lowercase words and brackets. */
function isTechRow(raw: string): boolean {
  const line = raw.trim();
  if (line.split(/\s+[·|•]\s+/).length >= 3) return true;
  const tokens = line.split(/[\s,]+/).filter(Boolean);
  return tokens.length >= 2 && tokens.length <= 12 && line.length <= 90
    && tokens.every((t) => /^[\p{Lu}0-9]/u.test(t) || t.length <= 3);
}

function bulletsAndExtras(lines: string[]) {
  const bullets: string[] = [];
  const plain: string[] = [];
  let technologies = '';
  for (const raw of lines) {
    if (TECH_LINE.test(raw) && !BULLET.test(raw)) {
      technologies = raw.replace(TECH_LINE, '').trim();
    } else if (BULLET.test(raw)) {
      bullets.push(strip(raw));
    } else if (bullets.length && !technologies && isTechRow(raw)) {
      technologies = raw.trim(); // unlabelled tech row under the bullets
    } else if (bullets.length) {
      bullets[bullets.length - 1] += ' ' + raw.trim(); // bullet wrapped to the next line
    } else {
      plain.push(raw.trim());
    }
  }
  return { bullets, plain, technologies };
}

function parseExperience(lines: string[]): ResumeData['experience'] {
  return toEntries(lines).map(({ head, lines: body }) => {
    const { start, end, current, rest } = takeDates(head);
    const { bullets, plain, technologies } = bulletsAndExtras(body);
    let { role, org } = roleAndOrg(parts(dropParens(rest)));
    // Company/role often sits on the line after the dated header.
    for (const p of plain) {
      if (role && org) break;
      const c = parts(p);
      if (!c.length) continue;
      if (!role && ROLE.test(p)) role = c[0];
      else if (!org) org = c[0];
      else if (!role) role = c[0];
    }
    const used = new Set([role, org]);
    return {
      id: uid(),
      title: role,
      company: org,
      startDate: start,
      endDate: end,
      current,
      bullets: bullets.length ? bullets : plain.filter((p) => !used.has(p)),
      technologies,
    };
  }).filter((e) => e.title || e.company || e.bullets.length);
}

function parseEducation(lines: string[]): ResumeData['education'] {
  return toEntries(lines).map(({ head, lines: body }) => {
    const { start, end, rest } = takeDates(head);
    const chunks = [...parts(rest), ...body.filter((l) => !BULLET.test(l)).flatMap(parts)];
    const degreeIdx = chunks.findIndex((c) => DEGREE.test(c));
    const schoolIdx = chunks.findIndex((c, i) => i !== degreeIdx && ORG.test(c));
    const degree = degreeIdx >= 0 ? chunks[degreeIdx] : '';
    const school = schoolIdx >= 0 ? chunks[schoolIdx] : chunks.find((c, i) => i !== degreeIdx) ?? '';
    const notes = [
      ...chunks.filter((c) => c !== degree && c !== school),
      ...body.filter((l) => BULLET.test(l)).map(strip),
    ].join(' · ');
    // Single year on an education entry is a graduation date, not a start date.
    const [startDate, endDate] = end ? [start, end] : ['', start];
    return { id: uid(), school: school || degree, degree: school ? degree : '', startDate, endDate, notes };
  }).filter((e) => e.school || e.degree);
}

function parseProjects(lines: string[]): ResumeData['projects'] {
  const entries: RawEntry[] = [];
  const anyUrl = lines.some((l) => URL.test(l));
  for (const raw of lines) {
    const last = entries[entries.length - 1];
    // With URLs in the layout they mark the project heads. Without them, fall
    // back to: a short line after a project that already has content.
    const starts = !BULLET.test(raw) && (anyUrl
      ? URL.test(raw)
      : !!last && last.lines.length > 0 && raw.trim().length < 60 && !/^[a-ząćęłńóśźż]/.test(raw.trim()));
    if (starts || !last) entries.push({ head: raw, lines: [] });
    else last.lines.push(raw);
  }
  return entries.map(({ head, lines: body }) => {
    const { rest } = takeDates(head);
    const url = (head.match(URL)?.[0] ?? body.map((b) => b.match(URL)?.[0]).find(Boolean) ?? '');
    const chunks = parts(dropParens(rest.replace(url, '')).trim());
    const { bullets, plain, technologies } = bulletsAndExtras(body);
    return {
      id: uid(),
      name: chunks[0] ?? '',
      description: chunks.slice(1).join(' · ') || plain[0] || '',
      url,
      bullets: bullets.length ? bullets : plain.slice(1),
      technologies,
    };
  }).filter((p) => p.name);
}

function parseCertifications(lines: string[]): ResumeData['certifications'] {
  return lines.map((raw) => {
    const line = strip(raw);
    const { start, rest } = takeDates(line);
    const chunks = parts(rest);
    return { id: uid(), name: chunks[0] ?? '', issuer: chunks.slice(1).join(', '), date: start };
  }).filter((c) => c.name);
}

// "JĘZYKI" in a sidebar means programming languages just as often as it means
// human ones. Anything under that heading that is not on this list is a skill.
const LANG_NAME = /^(polski|angielski|niemiecki|hiszpański|francuski|włoski|rosyjski|ukraiński|czeski|słowacki|chiński|japoński|koreański|arabski|portugalski|niderlandzki|holenderski|szwedzki|norweski|duński|fiński|węgierski|rumuński|turecki|grecki|hebrajski|hindi|english|polish|german|spanish|french|italian|russian|ukrainian|czech|slovak|chinese|mandarin|japanese|korean|arabic|portuguese|dutch|swedish|norwegian|danish|finnish|hungarian|romanian|turkish|greek|hebrew|deutsch|englisch|español|inglés|français|anglais|italiano|inglese)\b/i;

function parseLanguages(lines: string[]): { languages: ResumeData['languages']; rejected: string[] } {
  const all: Array<{ entry: ResumeData['languages'][number]; src: string }> = [];
  for (const raw of lines) {
    const line = strip(raw);
    // "English (C1), Polish (native)" on one line, or one language per line.
    const items = /,/.test(line) && !/[-–—:]/.test(line) ? line.split(',') : [line];
    for (const item of items) {
      const m = item.trim().match(/^(.+?)\s*(?:[-–—:(]|\s{2,})\s*(.+?)\)?$/);
      const name = (m ? m[1] : item).trim().replace(/[,;]$/, '');
      if (!name) continue;
      all.push({ entry: { id: uid(), name, level: m ? m[2].trim() : '' }, src: item.trim() });
    }
  }
  const known = all.filter((a) => LANG_NAME.test(a.entry.name));
  if (!known.length) return { languages: all.map((a) => a.entry), rejected: [] };
  return {
    languages: known.map((a) => a.entry),
    rejected: all.filter((a) => !LANG_NAME.test(a.entry.name)).map((a) => a.src),
  };
}

function parseSkills(lines: string[]): { skillGroups: ResumeData['skillGroups']; skills: string } {
  const skillGroups: ResumeData['skillGroups'] = [];
  const loose: string[] = [];
  for (const raw of lines) {
    const line = strip(raw);
    const m = line.match(/^([^:]{2,40}):\s*(.+)$/);
    if (m) skillGroups.push({ id: uid(), category: m[1].trim(), items: m[2].trim() });
    else loose.push(line);
  }
  const skills = loose.join(', ').replace(/\s*,\s*,+/g, ', ').trim();
  return { skillGroups, skills: skills || skillGroups.map((g) => g.items).join(', ') };
}

const NOT_A_PLACE = /portfolio|linked\s?in|github|gitlab|behance|dribbble|website|strona|www|e-?mail|telefon|phone|resume|kontakt|contact|developer|engineer|manager|specjalist|junior|senior|mid\b/i;

function parsePersonal(headerLines: string[], fullText: string): ResumeData['personal'] {
  const email = fullText.match(EMAIL)?.[0] ?? '';
  const noEmails = fullText.replace(new RegExp(EMAIL.source, 'g'), ' ');
  const phoneCandidate = fullText.split('\n').map((l) => (EMAIL.test(l) ? l.replace(EMAIL, ' ') : l))
    .map((l) => l.match(PHONE)?.[0]).find((p) => p && (p.match(/\d/g)?.length ?? 0) >= 9);
  const phone = phoneCandidate?.trim() ?? '';

  const links: ResumeData['personal']['links'] = [];
  const seen = new Set<string>();
  for (const [url] of noEmails.matchAll(URL_G)) {
    const clean = url.replace(/[.,;)]+$/, '');
    if (seen.has(clean.toLowerCase())) continue;
    seen.add(clean.toLowerCase());
    const label = /linkedin\./i.test(clean) ? 'LinkedIn'
      : /github\./i.test(clean) ? 'GitHub'
      : /gitlab\./i.test(clean) ? 'GitLab'
      : clean.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    links.push({ id: uid(), label, url: clean });
  }

  const isContact = (l: string) => EMAIL.test(l) || URL.test(l) || (l.match(/\d/g)?.length ?? 0) >= 7;
  const text = headerLines.filter((l) => !isContact(l));
  let name = text.find((l) => l.split(/\s+/).length <= 5 && !/\d/.test(l)) ?? '';
  let after = text.slice(text.indexOf(name) + 1);
  // Big display names get broken across two lines by the PDF text layer.
  if (name && !/\s/.test(name) && after[0] && /^\p{Lu}[\p{L}'-]+$/u.test(after[0])) {
    name = `${name} ${after[0]}`;
    after = after.slice(1);
  }
  const titleLine = after.find((l) => l.length < 70 && !/[.]\s/.test(l)) ?? '';
  // A wrong location is worse than none: only take something that reads like a place.
  const location = after.find((l) => l !== titleLine && l.length <= 40 && l.split(/\s+/).length <= 4
    && /^\p{Lu}/u.test(l) && !/[|·/]/.test(l) && !NOT_A_PLACE.test(l)) ?? '';

  const title = titleLine.replace(/[\s|·,-]+$/, '');
  return { name, title, email, phone, location, linkedin: '', website: '', links: links.slice(0, 6) };
}

export type Box = { x: number; y: number; w: number; s: string };

/**
 * Find the gutter of a two column layout: the widest vertical band nothing sits
 * in, ignoring the few items (page wide headers) that straddle it. Returns the
 * x to split at, or null for a single column page.
 */
function findGutter(boxes: Box[]): number | null {
  if (boxes.length < 20) return null;
  const left = Math.min(...boxes.map((b) => b.x));
  const right = Math.max(...boxes.map((b) => b.x + b.w));
  const STEP = 4;
  const buckets = Math.ceil((right - left) / STEP);
  const hits = new Array<number>(buckets).fill(0);
  for (const b of boxes) {
    const from = Math.floor((b.x - left) / STEP);
    const to = Math.ceil((b.x + b.w - left) / STEP);
    for (let i = from; i < to && i < buckets; i++) hits[i]++;
  }
  const noise = Math.max(1, Math.round(boxes.length * 0.03));

  let best: { at: number; width: number } | null = null;
  let runStart = -1;
  for (let i = 0; i <= buckets; i++) {
    const empty = i < buckets && hits[i] <= noise;
    if (empty && runStart < 0) runStart = i;
    if (!empty && runStart >= 0) {
      const width = (i - runStart) * STEP;
      const at = left + ((runStart + i) / 2) * STEP;
      if (width >= 16 && (!best || width > best.width)) best = { at, width };
      runStart = -1;
    }
  }
  if (!best) return null;
  const share = boxes.filter((b) => b.x < best!.at).length / boxes.length;
  return share > 0.08 && share < 0.92 ? best.at : null;
}

/** Boxes of one column into lines: grouped by y, ordered by x, top down. */
function toLines(boxes: Box[]): string[] {
  const rows = new Map<number, Box[]>();
  for (const b of boxes) {
    const key = [...rows.keys()].find((k) => Math.abs(k - b.y) <= 2) ?? b.y;
    if (!rows.has(key)) rows.set(key, []);
    rows.get(key)!.push(b);
  }
  const out: string[] = [];
  for (const [, items] of [...rows.entries()].sort((a, b) => b[0] - a[0])) {
    items.sort((a, b) => a.x - b.x);
    let line = '';
    let end = -Infinity;
    for (const it of items) {
      if (line && it.x - end > 1) line += ' ';
      line += it.s;
      end = it.x + it.w;
    }
    const clean = line.replace(/\s+/g, ' ').trim();
    if (clean) out.push(clean);
  }
  return out;
}

/**
 * Page boxes into text. Columns are detected and emitted one after another,
 * never interleaved: the parser does not care about section order, but it does
 * care that a sidebar is not shuffled into the middle of the job history.
 * Extra urls go first, so they land in the contact block, not the last section.
 */
export function textFromPages(pages: Box[][], urls: string[] = []): string {
  const lines: string[] = [];
  // One gutter for the whole document: a sidebar that runs thin on page 2 is
  // still a sidebar, and per page detection would miss it there.
  const gutter = findGutter(pages.flat());
  for (const boxes of pages) {
    if (gutter === null) lines.push(...toLines(boxes));
    else {
      lines.push(...toLines(boxes.filter((b) => b.x < gutter)));
      lines.push(...toLines(boxes.filter((b) => b.x >= gutter)));
    }
  }
  return [...urls, ...lines].join('\n');
}

export function parseResumeText(text: string): ResumeData {
  const lines = text.replace(/\r/g, '').split('\n');
  const s = splitSections(lines);
  const get = (k: string) => s[k] ?? [];
  const { languages, rejected } = parseLanguages(get('languages'));
  const { skillGroups, skills } = parseSkills([...get('skills'), ...rejected]);

  const headerLines = get('header');
  const summaryLines = get('summary');
  // Some resumes drop the profile blurb under the name with no heading at all.
  const orphanSummary = summaryLines.length ? '' : (headerLines.find((l) => l.length > 140) ?? '');

  return {
    personal: parsePersonal(headerLines.filter((l) => l !== orphanSummary), text),
    summary: summaryLines.length ? summaryLines.map(strip).join(' ') : orphanSummary,
    experience: parseExperience(get('experience')),
    education: parseEducation(get('education')),
    projects: parseProjects(get('projects')),
    certifications: parseCertifications(get('certifications')),
    languages,
    skillGroups,
    skills,
  };
}

export const isEmptyParse = (d: ResumeData) =>
  !d.personal.name && !d.personal.email && !d.summary &&
  !d.experience.length && !d.education.length && !d.skills && !d.skillGroups.length;
