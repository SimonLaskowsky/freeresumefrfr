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

type Section = 'header' | 'summary' | 'experience' | 'education' | 'projects' | 'certifications' | 'languages' | 'skills' | 'other';

const HEADINGS: Array<[Section, RegExp]> = [
  ['header', /^(contact|contact\s*details|personal\s*(info\w*|details)|kontakt|dane\s*(osobowe|kontaktowe)|contacto|contatti|kontakte?)\b/i],
  ['summary', /^(professional\s+|career\s+)?(summary|profile|objective|about\s*me|about|podsumowanie|profil|o\s*mnie|cel\s*zawodowy|resumen|perfil|profil\s*professionnel|à\s*propos|kurzprofil|zusammenfassung|über\s*mich|profilo|sobre\s*mim)\b/i],
  ['experience', /^(work\s+|working\s+|professional\s+|employment\s+|relevant\s+)?(experience|history|employment|career|doświadczenie(\s*zawodowe)?|zatrudnienie|praktyk\w*|kariera|experiencia(\s*laboral|\s*profesional)?|expérience(s)?(\s*professionnelle(s)?)?|berufserfahrung|erfahrung|werdegang|esperienza|experiência)\b/i],
  ['education', /^(education|academic\w*|qualifications|schooling|wykształcenie|edukacja|studia|szkoły|educación|formación|formation|éducation|ausbildung|bildung|studium|istruzione|formazione|educação)\b/i],
  ['projects', /^(side\s+|personal\s+|selected\s+)?(projects?|projekty|proyectos|projets|projekte|progetti|projetos)\b/i],
  ['certifications', /^(certifications?|certificates?|licen[sc]es?|courses?|training|awards?|certyfikaty|kursy|szkolenia|uprawnienia|nagrody|certificaciones|cursos|zertifikate|kurse|certificazioni|certificats)\b/i],
  ['languages', /^(languages?(\s*skills)?|języki(\s*obce)?|znajomość\s*języków|idiomas|langues|sprachen|lingue|idiomas)\b/i],
  ['skills', /^(technical\s+|core\s+|key\s+|hard\s+|soft\s+)?(skills|technologies|competenc\w+|expertise|tech\s*stack|toolbox|umiejętności|kompetencje|technologie|narzędzia|habilidades|competencias|compétences|kenntnisse|fähigkeiten|kompetenzen|competenze|conhecimentos|frameworks?i?|biblioteki|libraries|style|styles|cms|bazy\s*danych|databases|metodyki|methodologies)\b/i],
  // Sections the data model has no place for: better dropped than leaking into
  // whatever bucket happened to come before them.
  ['other', /^(publications?|publikacje|patents?|patenty|invited\s+talks?|talks?|referees?|references?|referencje|interests?|hobby|hobbies|zainteresowania|volunteer\w*|wolontariat|extracurricular\w*)\b/i],
];

// '¸' and '’' are how some fonts' '▸' and '→' glyphs come back out of the text layer
const BULLET = /^[•‣▪▸▹►▻◦●○·⁃■∙»>*+\-–—✓→¸’]\s+/;
const PRESENT = /present|currently|current|to\s*date|now|today|ongoing|obecnie|aktualnie|nadal|teraz|dziś|actualidad|actual|présent|aujourd'hui|heute|jetzt|laufend|attuale|atual/i;
// A word before a year is a month only if it starts like one, otherwise
// "Warszawski 2014" would parse as a date.
const MONTH = "(?:(?:sty|lut|mar|kwi|maj|cze|lip|sie|wrz|pa[źz]|lis|gru|jan|feb|apr|may|jun|jul|aug|sep|oct|nov|dec|ene|abr|ago|dic|f[ée]v|avr|mai|jui|d[ée]c|m[äa]r|okt|out|set|gen|mag|giu|lug|ott)[\\p{L}]{0,9}\\.?\\s*)?";
const YMD = `(?:\\d{1,2}[./]\\s*)?${MONTH}(?:19|20)\\d{2}`;
// The separator may also be plain whitespace: fancy dash glyphs vanish in
// extraction ("Sep. 2023  Mar. 2024"). Both sides must still be date shaped.
const RANGE = new RegExp(`(${YMD})\\s*(?:[-–—]|to\\b|do\\b|bis\\b|until\\b|au\\b|a\\b|–|\\s)\\s*(${YMD}|${PRESENT.source})`, 'iu');
const SINGLE_DATE = new RegExp(YMD, 'iu');
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+\w/;
const URL_SRC = '\\b((?:https?:\\/\\/|www\\.)[^\\s,;()<>]+|(?:[\\w-]+\\.)+(?:com|org|net|io|dev|me|co|pl|eu|app|xyz|ai|de|fr|es|it|uk)(?:\\/[^\\s,;()<>]*)?)';
const URL = new RegExp(URL_SRC, 'i');
const URL_G = new RegExp(URL_SRC, 'gi');
const PHONE = /(?:\+\d{1,3}[\s.-]?)?(?:\(\d{1,4}\)[\s.-]?)?\d[\d\s().-]{7,16}\d/;
const ROLE = /engineer|developer|programmer|manager|designer|analyst|consultant|specialist|director|lead\b|head\s+of|intern\b|architect|scientist|administrator|coordinator|assistant|officer|founder|freelanc|teacher|nurse|driver|technician|programist|inżynier|kierownik|specjalist|analityk|projektant|konsultant|stażyst|praktykant|dyrektor|handlow|sprzedaw|kelner|nauczyciel|technik|asystent|magazynier|kucharz|opiekun/i;
const DEGREE = /bachelor|master|\bb\.?\s?(sc|eng|s|a)\b|\bm\.?\s?(sc|eng|s|a)\b|ph\.?\s?d|mba|doctor|diploma|engineer|licencjat|inżynier|magister|technik|liceum|technikum|studia|licence|licenciatura|diplom|laurea/i;
const ORG = /\b(sp\.?\s*z\s*o\.?\s*o\.?|s\.\s?a\.|inc\b|llc\b|ltd\b|gmbh|corp\b|co\.|company|group|university|universit|uniwersytet|politechnika|akademia|szkoła|college|school|institute|instytut)\b/i;
const TECH_LINE = /^(tech(nolog\w+)?|stack|tools|skills|narzędzia|technologie)\s*[:\-–]\s*/i;

// The RODO/GDPR consent clause has no heading: it is a paragraph at the bottom
// that opens with a recognizable consent phrase. Once seen, the following
// wrapped lines belong to it too.
const CLAUSE = /wyrażam zgodę na przetwarzanie|zgod[ęy] na przetwarzanie|i hereby (?:give|grant) consent|consent (?:to|for) the processing of my personal data|autorizo el tratamiento|j'autorise le traitement|ich willige ein|autorizzo il trattamento|autorizo o tratamento/i;

const uid = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
const strip = (s: string) => s.replace(BULLET, '').trim();
const SPLIT = /\s*[|·•‖]\s*|\s+[-–—]\s+|\s*,\s*|\s+@\s+|\s+\bat\b\s+|\s+\bw\b\s+/i;

const ENTRY_SECTIONS = new Set(['experience', 'projects', 'education']);

/** "D O Ś W I A D C Z E N I E" is letter-spaced text, not 13 words. Collapses
 *  every such run inside the line, so a label-column row like
 *  "P O D S U M O W A N I E Specjalistka..." also comes out readable. Word
 *  gaps survive as runs of 2+ spaces ("A N N A  K O W A L S K A"). */
function unspace(line: string): string {
  return line.replace(/(^|\s)(\S{1,2}(?: \S{1,2}){2,})(?=\s|$)/g, (m, pre: string, run: string) => {
    const tokens = run.split(' ');
    const singles = tokens.filter((t) => t.length === 1).length;
    return singles / tokens.length >= 0.6 ? pre + tokens.join('') : m;
  });
}

function detectHeading(raw: string, cur: string): [Section, string] | null {
  // "// Experience" comment-style headings (the Dev template look)
  const line = unspace(raw.trim().replace(/[:：]\s*$/, '')).replace(/^\/{2,}\s*/, '');
  if (!line || BULLET.test(raw.trim())) return null;
  for (const [section, re] of HEADINGS) {
    const m = line.match(re);
    if (!m || m.index !== 0) continue;
    const rest = line.slice(m[0].length).replace(/^[\s:–—-]+/, '');
    // A label-column layout merges "DOŚWIADCZENIE" with the first content line
    // of the section: an upper-case heading followed by mixed-case content is
    // still a heading, however long the line.
    const capsHead = m[0] === m[0].toUpperCase() && !!rest && rest !== rest.toUpperCase();
    if (line.length > 60 && !capsHead) return null;
    // A heading is a heading, not a sentence: allow a short trailing remainder
    // ("Languages: English, Polish") but reject prose that merely starts with one.
    if (rest.split(/\s+/).filter(Boolean).length > 8 && !capsHead) return null;
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
    // page footers: "February 10, 2026  Jane Doe · Résumé 2", "Page 2 of 3"
    if (/r[ée]sum[ée]\s*\d+$/i.test(line) || /^page\s+\d+(\s+(of|\/|z)\s+\d+)?$/i.test(line)) continue;
    const hit = detectHeading(line, cur);
    if (hit) {
      // "NARZĘDZIA" inside the skills section is a group label that happens to
      // share vocabulary with the heading table: keep it as content.
      if (hit[0] === 'skills' && cur === 'skills' && !hit[1]) {
        out.skills.push(line);
        continue;
      }
      cur = hit[0];
      out[cur] ??= [];
      if (hit[1]) out[cur].push(hit[1]);
      continue;
    }
    if (cur !== 'clause' && CLAUSE.test(line)) cur = 'clause';
    // The clause is one paragraph: once a clause line closed a sentence,
    // anything that does not continue lowercase is other content (in a two
    // column layout the second column can be emitted right after it).
    else if (cur === 'clause' && out.clause?.length && /[.!]$/.test(out.clause[out.clause.length - 1]) && !/^\p{Ll}/u.test(line)) {
      cur = 'header';
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
    const openEnded = new RegExp(`${YMD}\\s*[-–—]\\s*$`, 'iu').test(line.trim()) || PRESENT.test(line);
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
    // A line that is nothing but a date belongs to the undated entry above it,
    // however far down the layout pushed it ("Magister / Uniwersytet / 2014-2019").
    const pureDate = startsEntry && !takeDates(strip(raw)).rest;
    if (startsEntry && last && !hasDate(last.head) && (pureDate || !last.lines.length)) last.head += ' | ' + raw;
    else if (startsEntry || entries.length === 0) {
      // "Google Inc." on one line, "Software Engineer  Oct 2016 - Present" on
      // the next: the org line above a dated line belongs to the new entry.
      let head = raw;
      const prev = last?.lines[last.lines.length - 1];
      const prevText = prev ? strip(prev) : '';
      if (startsEntry && prevText && prevText.length < 70 && !hasDate(prevText)
        && (ORG.test(prevText) || ROLE.test(prevText) || /\|/.test(prevText))
        && (ORG.test(prevText) || !/[.!?]$/.test(prevText))) {
        last.lines.pop();
        head = prevText + ' | ' + raw;
      }
      entries.push({ head, lines: [] });
    }
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
      : !!last && last.lines.length > 0 && raw.trim().length < 60 && !isTechRow(raw) && !/^[a-ząćęłńóśźż]/.test(raw.trim()));
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
  }).filter((p) => p.name.length > 2);
}

function parseCertifications(lines: string[]): ResumeData['certifications'] {
  const out: ResumeData['certifications'] = [];
  for (const raw of lines) {
    const line = strip(raw);
    const { start, rest } = takeDates(line);
    // A bare date line is the date of the cert above it.
    if (start && !rest.trim() && out.length && !out[out.length - 1].date) {
      out[out.length - 1].date = start;
      continue;
    }
    const chunks = parts(rest);
    // "Google · 2023" under a cert name is its issuer and date, not a new cert.
    const prev = out[out.length - 1];
    if (start && chunks.length === 1 && prev && !prev.issuer && !prev.date) {
      prev.issuer = chunks[0];
      prev.date = start;
      continue;
    }
    // "st"/"nd" superscript fragments and similar debris are not certificates
    if (chunks[0] && chunks[0].length > 2) out.push({ id: uid(), name: chunks[0], issuer: chunks.slice(1).join(', '), date: start });
  }
  return out;
}

// "JĘZYKI" in a sidebar means programming languages just as often as it means
// human ones. Anything under that heading that is not on this list is a skill.
const LANG_NAME = /^(polski|angielski|niemiecki|hiszpański|francuski|włoski|rosyjski|ukraiński|czeski|słowacki|chiński|japoński|koreański|arabski|portugalski|niderlandzki|holenderski|szwedzki|norweski|duński|fiński|węgierski|rumuński|turecki|grecki|hebrajski|hindi|english|polish|german|spanish|french|italian|russian|ukrainian|czech|slovak|chinese|mandarin|japanese|korean|arabic|portuguese|dutch|swedish|norwegian|danish|finnish|hungarian|romanian|turkish|greek|hebrew|deutsch|englisch|español|inglés|français|anglais|italiano|inglese)\b/i;

// Words that are a proficiency level, not a language: a row like "Polski
// Ojczysty" carries the level after a single space, and some layouts put the
// level on its own line under the language.
const LEVEL = /^(?:[abc][12][+]?|native|fluent|conversational|basic|intermediate|advanced|beginner|professional|ojczysty|biegły|biegle|zaawansowany|komunikatywny|podstawowy|średniozaawansowany|muttersprache|fließend|grundkenntnisse|nativo|fluido|básico|avanzado|natif|courant|intermédiaire|madrelingua|fluente|intermedio)$/i;

function parseLanguages(lines: string[]): { languages: ResumeData['languages']; rejected: string[] } {
  const all: Array<{ entry: ResumeData['languages'][number]; src: string }> = [];
  for (const raw of lines) {
    const line = strip(raw);
    // "English (C1), Polish (native)" on one line, or one language per line.
    const items = /,/.test(line) && !/[-–—:]/.test(line) ? line.split(',') : [line];
    for (const item of items) {
      // drop proficiency rating glyphs ("English ○ ○ ○ ● ●")
      const clean = item.trim().replace(/[○●◔◑◕★☆▮▯|]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/[,;]$/, '');
      if (!clean) continue;
      // A bare level line belongs to the language above it.
      if (LEVEL.test(clean) && all.length && !all[all.length - 1].entry.level) {
        all[all.length - 1].entry.level = clean;
        continue;
      }
      const m = clean.match(/^(.+?)\s*(?:[-–—:(]|\s{2,})\s*(.+?)\)?$/);
      let name = (m ? m[1] : clean).trim();
      let level = m ? m[2].trim() : '';
      if (!level) {
        const sp = name.match(/^(.+)\s+(\S+)$/);
        if (sp && LEVEL.test(sp[2])) { name = sp[1].trim(); level = sp[2]; }
      }
      if (!level) {
        // italic rendering can split the level: "Polski O jczysty"
        const sp = name.match(/^(.+)\s+(\S+)\s+(\S+)$/);
        if (sp && LEVEL.test(sp[2] + sp[3])) { name = sp[1].trim(); level = sp[2] + sp[3]; }
      }
      if (!name) continue;
      all.push({ entry: { id: uid(), name, level }, src: item.trim() });
    }
  }
  const known = all.filter((a) => LANG_NAME.test(a.entry.name));
  if (!known.length) {
    // "Languages: Python, C++" is a skills row wearing a languages heading.
    const techy = /python|java|c\+\+|c#|sql|html|css|typescript|javascript|php|ruby|rust|kotlin|swift|golang|\bgo\b|kubernetes|docker|aws|react|node/i;
    if (all.some((a) => techy.test(a.src))) return { languages: [], rejected: all.map((a) => a.src) };
    return { languages: all.map((a) => a.entry), rejected: [] };
  }
  return {
    languages: known.map((a) => a.entry),
    rejected: all.filter((a) => !LANG_NAME.test(a.entry.name)).map((a) => a.src),
  };
}

function parseSkills(lines: string[]): { skillGroups: ResumeData['skillGroups']; skills: string } {
  const skillGroups: ResumeData['skillGroups'] = [];
  const loose: string[] = [];
  // an ALL-CAPS line is a group header; it collects every line until the next one
  let group: ResumeData['skillGroups'][number] | null = null;
  for (const raw of lines) {
    const line = strip(raw);
    const m = line.match(/^([^:]{2,40}):\s*(.+)$/);
    if (m) {
      skillGroups.push({ id: uid(), category: m[1].trim(), items: m[2].trim() });
      group = null;
    } else if (line.length >= 4 && line.length <= 30 && !/[,;]/.test(line) && line === line.toUpperCase() && /\p{L}/u.test(line)) {
      group = { id: uid(), category: line, items: '' };
      skillGroups.push(group);
    } else if (group) {
      group.items = group.items ? `${group.items}, ${line}` : line;
    } else {
      loose.push(line);
    }
  }
  const groups = skillGroups.filter((g) => g.items);
  const skills = loose.join(', ').replace(/\s*,\s*,+/g, ', ').trim();
  return { skillGroups: groups, skills: skills || skillGroups.map((g) => g.items).join(', ') };
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
  // unspace: display names come letter-spaced out of some layouts
  const text = headerLines.map(unspace).filter((l) => !isContact(l));
  let name = text.find((l) => l.split(/\s+/).length <= 5 && !/\d/.test(l)) ?? '';
  let after = text.slice(text.indexOf(name) + 1);
  // Big display names get broken across two lines by the PDF text layer.
  if (name && !/\s/.test(name) && after[0] && /^\p{Lu}[\p{L}'-]+$/u.test(after[0])) {
    name = `${name} ${after[0]}`;
    after = after.slice(1);
  }
  // "Sourabh Bajaj  Email: sourabh@..." : the name can share its line with the
  // contact details.
  if (!name) {
    for (const l of headerLines.slice(0, 5)) {
      const bare = unspace(l)
        .replace(new RegExp(EMAIL.source, 'g'), ' ')
        .replace(URL_G, ' ')
        .replace(new RegExp(PHONE.source, 'g'), ' ')
        .replace(/\b(e-?mail|mobile|phone|tel(efon)?|kontakt|adres|address)\b\s*:?/gi, ' ')
        .replace(/[|·•:,]+/g, ' ')
        .replace(/\s+/g, ' ').trim();
      const words = bare.split(' ').filter(Boolean);
      if (words.length >= 2 && words.length <= 5 && !/\d/.test(bare)
        && words.every((w) => /^\p{Lu}/u.test(w))) { name = bare; break; }
    }
  }
  // Prefer a line that names a role: "Specjalistka ds. marketingu" contains
  // ". " yet is a title, not prose.
  const titleLine = after.find((l) => l.length < 70 && ROLE.test(l))
    ?? after.find((l) => l.length < 70 && !/[.]\s/.test(l)) ?? '';
  // A wrong location is worse than none: only take something that reads like a place.
  const isPlace = (l: string) => l.length <= 40 && l.split(/\s+/).length <= 4
    && /^\p{Lu}/u.test(l) && !/[|·/@\d]/.test(l) && !NOT_A_PLACE.test(l);
  const location = after.find((l) => l !== titleLine && isPlace(l))
    // "email · phone · Warszawa · LinkedIn": the city usually rides the contact row
    ?? headerLines.filter(isContact).flatMap((l) => l.split(/\s*[|·•&]\s*/)).map((c) => c.trim()).find(isPlace)
    ?? '';

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
  const lhs = boxes.filter((b) => b.x < best!.at);
  const share = lhs.length / boxes.length;
  if (share <= 0.08 || share >= 0.92) return null;
  // Right-aligned metadata (dates, language levels) is not a second column: it
  // sits on the same baselines as the text to its left, while a real column
  // has rows of its own. Reject the gutter when the smaller side mostly shares
  // baselines with the bigger one.
  const rhs = boxes.filter((b) => b.x >= best!.at);
  const [small, big] = lhs.length <= rhs.length ? [lhs, rhs] : [rhs, lhs];
  const ys = new Set(big.map((b) => b.y));
  const aligned = small.filter((b) => [-2, -1, 0, 1, 2].some((d) => ys.has(b.y + d))).length;
  return aligned / small.length > 0.6 ? null : best.at;
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
      // a clearly larger jump is a word gap: keep it as a double space so
      // letter-spaced words ("A N N A  K O W A L S K A") stay separable
      if (line && it.x - end > 1) line += it.x - end > 6 ? '  ' : ' ';
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
    rodoClause: get('clause').map(strip).join(' '),
  };
}

export const isEmptyParse = (d: ResumeData) =>
  !d.personal.name && !d.personal.email && !d.summary &&
  !d.experience.length && !d.education.length && !d.skills && !d.skillGroups.length;
