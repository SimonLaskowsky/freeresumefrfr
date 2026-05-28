import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { SANS } from './fonts';
import type { ResumeData } from '@/store/resumeStore';

interface Props {
  data: ResumeData;
  labels: { summary: string; experience: string; education: string; skills: string; projects: string; certifications: string; languages: string; contact: string; present: string; };
  accentColor: string;
  companyLogo?: string;
}

const s = StyleSheet.create({
  page: { fontFamily: SANS, fontSize: 10, color: '#1a1a1a', paddingTop: 24, paddingBottom: 40 },
  header: { paddingTop: 4, paddingBottom: 24, paddingHorizontal: 48 },
  name: { fontSize: 26, fontFamily: SANS, fontWeight: 700, color: '#ffffff', marginBottom: 4, letterSpacing: 0.2 },
  titleLine: { fontSize: 11, color: '#ffffff', opacity: 0.85, marginBottom: 10 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', fontSize: 8.5, color: '#ffffff', opacity: 0.75 },
  contactSep: { marginHorizontal: 6, color: '#ffffff', opacity: 0.4 },
  body: { paddingHorizontal: 48, paddingTop: 8 },
  sectionBlock: { marginTop: 14, flexDirection: 'row' },
  sectionBar: { width: 4, marginRight: 12, borderRadius: 2 },
  sectionContent: { flex: 1 },
  sectionTitle: { fontSize: 9, fontFamily: SANS, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 },
  expItem: { marginBottom: 9 },
  expRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  expTitle: { fontFamily: SANS, fontWeight: 700, fontSize: 10.5 },
  expDates: { fontSize: 8.5, color: '#6b7280' },
  expCompany: { fontSize: 9.5, color: '#4b5563', marginBottom: 2 },
  bullet: { flexDirection: 'row', marginTop: 2, paddingLeft: 6 },
  bulletDot: { width: 10, color: '#9ca3af' },
  bulletText: { flex: 1, fontSize: 9.5, color: '#374151', lineHeight: 1.4 },
  eduItem: { marginBottom: 7 },
  eduRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  eduDegree: { fontFamily: SANS, fontWeight: 700, fontSize: 10.5 },
  eduDates: { fontSize: 8.5, color: '#6b7280' },
  eduSchool: { fontSize: 9.5, color: '#4b5563' },
  eduNotes: { fontSize: 9, color: '#6b7280', marginTop: 1 },
  skills: { fontSize: 9.5, color: '#374151', lineHeight: 1.5 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start' },
  headerText: { flex: 1 },
  photo: { width: 72, height: 72, marginRight: 18, marginTop: 2, objectFit: 'cover' },
});

export function SharpTemplate({ data, labels, accentColor, companyLogo }: Props) {
  const { personal, experience, education, skills } = data;
  const contact = [personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean);

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <View style={s.sectionBlock} minPresenceAhead={60} wrap={false}>
        <View style={[s.sectionBar, { backgroundColor: accentColor }]} />
        <View style={s.sectionContent}>
          <Text style={[s.sectionTitle, { color: accentColor }]}>{title.toUpperCase()}</Text>
          {children}
        </View>
      </View>
    );
  }

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {companyLogo && (
          <View style={{ position: 'absolute', bottom: 24, right: 24 }}>
            <Image src={companyLogo} style={{ width: 160, height: 160, opacity: 0.10, objectFit: 'contain' }} />
          </View>
        )}
        <View style={[s.header, { backgroundColor: accentColor }]}>
          <View style={s.headerRow}>
            {personal.photo && <Image src={personal.photo} style={s.photo} />}
            <View style={s.headerText}>
              {personal.name && <Text style={s.name}>{personal.name}</Text>}
              {personal.title && <Text style={s.titleLine}>{personal.title}</Text>}
              {contact.length > 0 && (
                <View style={s.contactRow}>
                  {contact.map((item, i) => (
                    <View key={i} style={{ flexDirection: 'row' }}>
                      {i > 0 && <Text style={s.contactSep}>·</Text>}
                      <Text>{item}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={s.body}>
          {data.summary && (
            <Section title={labels.summary}>
              <Text style={{ fontSize: 9.5, color: '#374151', lineHeight: 1.5 }}>{data.summary}</Text>
            </Section>
          )}

          {experience.length > 0 && (
            <Section title={labels.experience}>
              {experience.map((exp) => {
                const bullets = (exp.bullets || []).filter((b) => b.trim());
                const dateRange = exp.current
                  ? `${exp.startDate} – ${labels.present}`
                  : [exp.startDate, exp.endDate].filter(Boolean).join(' – ');
                return (
                  <View key={exp.id} style={s.expItem} wrap={false}>
                    <View style={s.expRow}>
                      <Text style={s.expTitle}>{exp.title}</Text>
                      {dateRange && <Text style={s.expDates}>{dateRange}</Text>}
                    </View>
                    {exp.company && <Text style={s.expCompany}>{exp.company}</Text>}
                    {bullets.map((b, i) => (
                      <View key={i} style={s.bullet}>
                        <Text style={s.bulletDot}>•</Text>
                        <Text style={s.bulletText}>{b.trim()}</Text>
                      </View>
                    ))}
                  {exp.technologies && exp.technologies.trim() && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
                      {exp.technologies.split(',').filter((t: string) => t.trim()).map((tech: string, idx: number) => (
                        <View key={idx} style={{ borderWidth: 0.5, borderColor: accentColor, borderRadius: 2, paddingHorizontal: 4, paddingVertical: 1.5, marginRight: 3, marginBottom: 2 }}>
                          <Text style={{ fontSize: 7.5, color: accentColor }}>{tech.trim()}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  </View>
                );
              })}
            </Section>
          )}

          {data.projects && data.projects.length > 0 && (
            <Section title={labels.projects}>
              {data.projects.map((proj) => {
                const bullets = (proj.bullets || []).filter((b) => b.trim());
                return (
                  <View key={proj.id} style={s.expItem} wrap={false}>
                    <View style={s.expRow}>
                      <Text style={s.expTitle}>{proj.name}</Text>
                      {proj.url && <Text style={{ fontSize: 8.5, color: accentColor }}>{proj.url}</Text>}
                    </View>
                    {proj.description && <Text style={s.expCompany}>{proj.description}</Text>}
                    {bullets.map((b, i) => (
                      <View key={i} style={s.bullet}>
                        <Text style={s.bulletDot}>•</Text>
                        <Text style={s.bulletText}>{b.trim()}</Text>
                      </View>
                    ))}
                  {proj.technologies && proj.technologies.trim() && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
                      {proj.technologies.split(',').filter((t: string) => t.trim()).map((tech: string, idx: number) => (
                        <View key={idx} style={{ borderWidth: 0.5, borderColor: accentColor, borderRadius: 2, paddingHorizontal: 4, paddingVertical: 1.5, marginRight: 3, marginBottom: 2 }}>
                          <Text style={{ fontSize: 7.5, color: accentColor }}>{tech.trim()}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  </View>
                );
              })}
            </Section>
          )}

          {education.length > 0 && (
            <Section title={labels.education}>
              {education.map((edu) => {
                const dateRange = [edu.startDate, edu.endDate].filter(Boolean).join(' – ');
                return (
                  <View key={edu.id} style={s.eduItem} wrap={false}>
                    <View style={s.eduRow}>
                      <Text style={s.eduDegree}>{[edu.degree, edu.school].filter(Boolean).join(' · ')}</Text>
                      {dateRange && <Text style={s.eduDates}>{dateRange}</Text>}
                    </View>
                    {edu.notes && <Text style={s.eduNotes}>{edu.notes}</Text>}
                  </View>
                );
              })}
            </Section>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <Section title={labels.certifications}>
              {data.certifications.map((cert, idx) => (
                <View
                  key={cert.id}
                  style={{
                    marginBottom: idx === data.certifications!.length - 1 ? 0 : 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ fontSize: 9.5, fontFamily: SANS, fontWeight: 700 }}>{cert.name}{cert.issuer ? ` · ${cert.issuer}` : ''}</Text>
                  {cert.date && <Text style={{ fontSize: 8.5, color: '#6b7280' }}>{cert.date}</Text>}
                </View>
              ))}
            </Section>
          )}

          {data.languages && data.languages.length > 0 && (
            <Section title={labels.languages}>
              {(data.languages ?? []).map((lang, idx) => (
                <View key={lang.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: idx === (data.languages ?? []).length - 1 ? 0 : 3 }}>
                  <Text style={{ fontSize: 9.5, fontFamily: SANS, fontWeight: 700 }}>{lang.name}</Text>
                  {lang.level ? <Text style={{ fontSize: 9, color: '#6b7280' }}>{lang.level}</Text> : null}
                </View>
              ))}
            </Section>
          )}

          {skills && (
            <Section title={labels.skills}>
              {data.skillGroups && data.skillGroups.length > 0 ? (
              <View>
                {data.skillGroups.map((group, idx) => (
                  <View key={group.id} style={{ marginBottom: idx < data.skillGroups!.length - 1 ? 5 : 0 }}>
                    {group.category ? <Text style={{ fontSize: 7.5, fontFamily: SANS, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: accentColor, marginBottom: 2 }}>{group.category}</Text> : null}
                    <Text style={s.skills}>{group.items}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={s.skills}>{skills}</Text>
            )}
            </Section>
          )}
        </View>
      </Page>
    </Document>
  );
}
