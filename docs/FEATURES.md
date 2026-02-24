# freeresumefrfr — Feature Roadmap

## v1 — Ship It (Current)

The MVP. Does exactly what it promises and nothing more.

### Landing Page
- [x] Hero section with tagline and roast copy
- [x] "Paywalls dodged" counter (localStorage, increments on each download)
- [x] CTA button → /builder
- [x] Footer with GitHub link

### Builder (/builder)
- [x] Personal info section (name, title, email, phone, location, LinkedIn, website)
- [x] Work experience (company, title, dates, bullet points)
- [x] Education (school, degree, dates, notes)
- [x] Skills (freeform, comma-separated)
- [x] Live preview (react-pdf rendered in-browser)
- [x] Download PDF button — always visible, always free
- [x] localStorage persistence (data survives page refresh)

### Resume Template
- [x] Classic — clean, ATS-friendly single column layout

---

## v2 — Polish

- [ ] Multiple templates (Modern, Minimal, Two-column)
- [ ] Custom section ordering via drag-and-drop
- [ ] ATS tips tooltip on each section
- [ ] Share resume via URL (base64 encoded state in URL hash)
- [ ] Undo/redo history

---

## v3 — Optional Accounts

- [ ] Supabase auth (GitHub, Google OAuth)
- [ ] Cloud sync — save multiple resumes
- [ ] Resume versioning
- [ ] Cover letter builder (same deal — always free to download)

---

## Never List

These features will never exist in freeresumefrfr:

- ~~Paywall on downloads~~ (the whole point)
- ~~Watermark on free tier~~ (there is no "tier")
- ~~"Premium" templates~~ (all templates are free)
- ~~Required account to use core features~~ (browser-local forever)
- ~~Ads in the resume preview~~
- ~~Selling user data~~
- ~~Email capture before download~~

---

## Tech Notes

- PDF generation is entirely client-side via `@react-pdf/renderer` — no file hits our servers
- State managed with Zustand, persisted to localStorage
- No backend required for v1
- Hosted on Vercel free tier (no server costs)
