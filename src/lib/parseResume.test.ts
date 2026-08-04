// Run: npm run test:parse
import assert from 'node:assert/strict';
import { parseResumeText } from './parseResume.js';

const HEAD = `Alex Rivera
Senior Software Engineer
San Francisco, CA
alex@email.com · (415) 555-0192 · linkedin.com/in/alexrivera
`;

const EXPERIENCE = `EXPERIENCE
Senior Software Engineer — Stripe | Jan 2022 - Present
• Led migration of payment pipeline to event-driven architecture, cutting latency by 40%
• Built the Radar fraud dashboard used by 50k+ merchants
Technologies: Go, Kafka, React
Software Engineer — Linear | Jun 2020 – Dec 2021
• Owned the realtime sync engine powering collaborative editing
`;

const EDUCATION = `EDUCATION
B.S. Computer Science, UC Berkeley, 2016 - 2020
GPA 3.8
`;

const SKILLS = `SKILLS
Frontend: TypeScript, React, Next.js
Backend: Rust, PostgreSQL, Kafka
`;

const LANGUAGES = `LANGUAGES
English — Native
Spanish — B2
`;

const CERTS = `CERTIFICATIONS
AWS Solutions Architect — Amazon — 2023
`;

const order1 = HEAD + EXPERIENCE + EDUCATION + SKILLS + LANGUAGES + CERTS;
const order2 = HEAD + SKILLS + LANGUAGES + CERTS + EDUCATION + EXPERIENCE;

const strip = (d: ReturnType<typeof parseResumeText>) =>
  JSON.parse(JSON.stringify(d, (k, v) => (k === 'id' ? undefined : v)));

// --- order independence ------------------------------------------------
assert.deepEqual(strip(parseResumeText(order1)), strip(parseResumeText(order2)), 'section order must not matter');

// --- content -----------------------------------------------------------
const r = parseResumeText(order1);
assert.equal(r.personal.name, 'Alex Rivera');
assert.equal(r.personal.title, 'Senior Software Engineer');
assert.equal(r.personal.email, 'alex@email.com');
assert.match(r.personal.phone, /555-0192/);
assert.equal(r.personal.links?.[0].label, 'LinkedIn');

assert.equal(r.experience.length, 2);
assert.equal(r.experience[0].title, 'Senior Software Engineer');
assert.equal(r.experience[0].company, 'Stripe');
assert.equal(r.experience[0].startDate, 'Jan 2022');
assert.equal(r.experience[0].current, true);
assert.equal(r.experience[0].bullets.length, 2);
assert.equal(r.experience[0].technologies, 'Go, Kafka, React');
assert.equal(r.experience[1].endDate, 'Dec 2021');
assert.equal(r.experience[1].current, false);

assert.equal(r.education.length, 1);
assert.equal(r.education[0].school, 'UC Berkeley');
assert.equal(r.education[0].degree, 'B.S. Computer Science');
assert.equal(r.education[0].endDate, '2020');

assert.equal(r.skillGroups.length, 2);
assert.equal(r.skillGroups[0].category, 'Frontend');
assert.equal(r.languages.length, 2);
assert.equal(r.languages[1].level, 'B2');
assert.equal(r.certifications[0].name, 'AWS Solutions Architect');
assert.equal(r.certifications[0].date, '2023');

// --- polish CV, different layout, headings with inline content ---------
const pl = parseResumeText(`Jan Kowalski
Specjalista ds. sprzedaży
jan.kowalski@wp.pl | +48 601 234 567 | Warszawa

DOŚWIADCZENIE ZAWODOWE
Kierownik Sprzedaży, Auchan Polska sp. z o.o.
03.2019 – obecnie
- Zarządzanie zespołem 12 handlowców
- Wzrost przychodów o 25% rok do roku

WYKSZTAŁCENIE
Uniwersytet Warszawski, magister ekonomii, 2014 - 2019

JĘZYKI: angielski (C1), niemiecki (A2)

UMIEJĘTNOŚCI
Negocjacje, CRM, Excel
`);
assert.equal(pl.personal.name, 'Jan Kowalski');
assert.equal(pl.personal.phone.trim(), '+48 601 234 567');
assert.equal(pl.experience.length, 1);
assert.equal(pl.experience[0].current, true);
assert.equal(pl.experience[0].company, 'Auchan Polska sp. z o.o.');
assert.equal(pl.experience[0].bullets.length, 2);
assert.equal(pl.education[0].school, 'Uniwersytet Warszawski');
assert.equal(pl.languages.length, 2);
assert.equal(pl.languages[0].name, 'angielski');
assert.equal(pl.skills, 'Negocjacje, CRM, Excel');

// --- real two column CV, as the extractor emits it (sidebar first) -----
// Letter spaced headings, dates glued to the role, tech rows with no label,
// a sidebar "JĘZYKI" that means programming languages.
const twoCol = parseResumeText(`https://github.com/SimonLaskowsky
Szymon
Laskowski
Frontend Developer · Next.js |
K O N T A K T
simonlaskowsky@gmail.com
731531571
Katowice
Portfolio
GitHub
U M I E J Ę T N O Ś C I
JĘZYKI
JavaScript (ES6+)
TypeScript
FRAMEWORKI
Next.js
Vue
P O D S U M OW A N I E
Frontend Developer z 3-letnim komercyjnym doświadczeniem w ekosystemie React.
D O Ś W I A D C Z E N I E
Frontend Developer (pełny etat, zdalnie) Lis 2024 – Obecnie
SOFTWARE THINGS
• Realizacje obejmują m.in. portal miejski Bielsko-Biała oraz oficjalną stronę Mateusza
Sochy (sprzedaż biletów, archiwum wideo, newsletter).
Next.js React TypeScript Vue Tailwind
J Ę Z Y K I
Polski — Ojczysty
Angielski — B2
P R O J E K T Y
RYNKORADAR https://www.rynkoradar.pl/
Interaktywna mapa cen mieszkań na polskim rynku nieruchomości
• Budowa dynamicznej mapy dzielnicowej z analizą trendów cenowych
Next.js · TypeScript · MapLibre GL
C E R T Y F I K A T Y
CS50: Introduction to Computer Science · Harvard University Wrz 2024
`);

assert.equal(twoCol.personal.name, 'Szymon Laskowski', 'display name split across two lines');
assert.equal(twoCol.personal.location, 'Katowice');
assert.equal(twoCol.personal.links?.[0].label, 'GitHub');
assert.match(twoCol.summary, /^Frontend Developer z 3-letnim/);
assert.equal(twoCol.experience.length, 1);
assert.equal(twoCol.experience[0].title, 'Frontend Developer', 'parenthesised qualifier is not a company');
assert.equal(twoCol.experience[0].company, 'SOFTWARE THINGS');
assert.equal(twoCol.experience[0].current, true);
assert.match(twoCol.experience[0].bullets[0], /newsletter\)\.$/, 'wrapped bullet is joined back');
assert.equal(twoCol.experience[0].technologies, 'Next.js React TypeScript Vue Tailwind');
assert.equal(twoCol.projects.length, 1);
assert.equal(twoCol.projects[0].name, 'RYNKORADAR');
assert.equal(twoCol.projects[0].url, 'https://www.rynkoradar.pl/');
assert.equal(twoCol.projects[0].description, 'Interaktywna mapa cen mieszkań na polskim rynku nieruchomości');
assert.equal(twoCol.projects[0].technologies, 'Next.js · TypeScript · MapLibre GL');
assert.equal(twoCol.certifications[0].date, 'Wrz 2024');
assert.deepEqual(twoCol.languages.map((l) => l.name), ['Polski', 'Angielski'], 'JavaScript is not a language');
assert.match(twoCol.skills, /JavaScript \(ES6\+\)/);

console.log('parseResume: all assertions passed');
