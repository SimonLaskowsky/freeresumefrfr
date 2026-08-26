import { Document, Page, Text, View, Image, StyleSheet, Link } from '@react-pdf/renderer';
import { SANS } from './fonts';
import type { ResumeData } from '@/store/resumeStore';

interface Labels {
  summary: string;
  experience: string;
  education: string;
  skills: string;
  projects: string;
  certifications: string; languages: string;
  contact: string;
  present: string;
}

const ACCENT = '#60a5fa';

const s = StyleSheet.create({
  page: { flexDirection: 'row', fontFamily: SANS, fontSize: 9.5 },
  sidebar: { width: 178, padding: '36 16 36 18' },
  main: { flex: 1, padding: '36 26 36 22' },

  sName: { fontSize: 17, fontFamily: SANS, fontWeight: 700, color: '#ffffff', marginBottom: 3, lineHeight: 1.2 },
  sTitle: { fontSize: 9.5, color: '#93c5fd', marginBottom: 18, fontFamily: SANS, fontStyle: 'italic' },
  sSectionTitle: {
    fontSize: 7, fontFamily: SANS, fontWeight: 700, letterSpacing: 1.5, color: ACCENT,
    textTransform: 'uppercase', marginBottom: 6, marginTop: 16,
    borderBottomWidth: 0.5, borderBottomColor: '#1e3a5f', paddingBottom: 3,
  },
  sItem: { color: '#cbd5e1', fontSize: 8.5, marginBottom: 3.5, lineHeight: 1.4 },

  mSectionTitle: {
    fontSize: 8.5, fontFamily: SANS, fontWeight: 700, letterSpacing: 1,
    textTransform: 'uppercase', marginBottom: 2, marginTop: 14,
  },
  mDivider: { borderBottomWidth: 1, marginBottom: 7 },

  expItem: { marginBottom: 8 },
  expRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  expTitle: { fontFamily: SANS, fontWeight: 700, fontSize: 10 },
  expDates: { fontSize: 8.5, color: '#6b7280' },
  expCompany: { fontSize: 9, color: '#4b5563', marginBottom: 2 },
  bullet: { flexDirection: 'row', marginTop: 1.5, paddingLeft: 4 },
  bulletDot: { width: 10, color: '#9ca3af' },
  bulletText: { flex: 1, fontSize: 9, color: '#374151', lineHeight: 1.4 },

  eduItem: { marginBottom: 6 },
  eduRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  eduDegree: { fontFamily: SANS, fontWeight: 700, fontSize: 10 },
  eduDates: { fontSize: 8.5, color: '#6b7280' },
  eduSchool: { fontSize: 9, color: '#4b5563' },
  eduNotes: { fontSize: 8.5, color: '#6b7280', marginTop: 1 },
  photo: { width: 144, height: 180, marginBottom: 16, objectFit: 'cover' },
});

export function ModernTemplate({ data, labels, accentColor, companyLogo }: { data: ResumeData; labels: Labels; accentColor: string; companyLogo?: string }) {
  const { personal, experience, education, skills } = data;
  const contact: { text: string; url?: string }[] = [
    { text: personal.email }, { text: personal.phone }, { text: personal.location },
    { text: personal.linkedin }, { text: personal.website },
    ...(personal.links ?? []).map((l) => ({
      text: l.label || l.url,
      url: l.url.startsWith('http') ? l.url : `https://${l.url}`,
    })),
  ].filter((c) => Boolean(c.text));
  const skillList = skills.split(',').map((sk) => sk.trim()).filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {companyLogo && (
          <View fixed style={{ position: 'absolute', bottom: 24, right: 24 }}>
            <Image src={companyLogo} style={{ width: 160, height: 160, opacity: 0.10, objectFit: 'contain' }} />
          </View>
        )}
        {/* Sidebar */}
        <View style={[s.sidebar, { backgroundColor: accentColor }]}>
          {personal.photo && <Image src={personal.photo} style={s.photo} />}
          {personal.name && <Text style={s.sName}>{personal.name}</Text>}
          {personal.title && <Text style={s.sTitle}>{personal.title}</Text>}
          {contact.length > 0 && (
            <View wrap={false}>
              <Text style={s.sSectionTitle}>{labels.contact}</Text>
              {contact.map((item, i) => item.url
                ? <Link key={i} src={item.url} style={{ color: '#cbd5e1', textDecoration: 'underline' }}><Text style={s.sItem}>{item.text}</Text></Link>
                : <Text key={i} style={s.sItem}>{item.text}</Text>
              )}
            </View>
          )}
          {(data.skillGroups && data.skillGroups.length > 0 ? true : skillList.length > 0) && (
            <View wrap={false}>
              <Text style={s.sSectionTitle}>{labels.skills}</Text>
              {data.skillGroups && data.skillGroups.length > 0 ? (
                <View>
                  {data.skillGroups.map((group, idx) => (
                    <View key={group.id} style={{ marginBottom: idx < data.skillGroups!.length - 1 ? 6 : 0 }}>
                      {group.category ? <Text style={{ fontSize: 7, fontFamily: SANS, fontWeight: 700, letterSpacing: 0.5, color: '#e2e8f0', textTransform: 'uppercase', marginBottom: 3 }}>{group.category}</Text> : null}
                      {group.items.split(',').filter((t: string) => t.trim()).map((skill: string, i: number) => (
                        <Text key={i} style={s.sItem}>{skill.trim()}</Text>
                      ))}
                    </View>
                  ))}
                </View>
              ) : (
                skillList.map((skill, i) => <Text key={i} style={s.sItem}>{skill}</Text>)
              )}
            </View>
          )}
          {data.languages && data.languages.length > 0 && (
            <View wrap={false}>
              <Text style={s.sSectionTitle}>{labels.languages}</Text>
              {(data.languages ?? []).map((lang) => (
                <Text key={lang.id} style={s.sItem}>{lang.name}{lang.level ? `: ${lang.level}` : ''}</Text>
              ))}
            </View>
          )}
        </View>

        {/* Main */}
        <View style={s.main}>
          {data.summary && (
            <View>
              <View minPresenceAhead={120}>
                <Text style={[s.mSectionTitle, { color: accentColor }]}>{labels.summary}</Text>
              </View>
              <View style={[s.mDivider, { borderBottomColor: accentColor }]} />
              <Text style={{ fontSize: 9, color: '#374151', lineHeight: 1.5, marginBottom: 8 }}>{data.summary}</Text>
            </View>
          )}

          {experience.length > 0 && (
            <View>
              <View minPresenceAhead={120}>
                <Text style={[s.mSectionTitle, { color: accentColor }]}>{labels.experience}</Text>
              </View>
              <View style={[s.mDivider, { borderBottomColor: accentColor }]} />
              {experience.map((exp) => {
                const bullets = (exp.bullets || []).filter((b) => b.trim());
                const dateRange = exp.current
                  ? `${exp.startDate} - ${labels.present}`
                  : [exp.startDate, exp.endDate].filter(Boolean).join(' - ');
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
            </View>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <View wrap={false}>
              <View minPresenceAhead={120}>
                <Text style={[s.mSectionTitle, { marginTop: 14, color: accentColor }]}>{labels.projects}</Text>
              </View>
              <View style={[s.mDivider, { borderBottomColor: accentColor }]} />
              {data.projects.map((proj) => {
                const bullets = (proj.bullets || []).filter((b) => b.trim());
                return (
                  <View key={proj.id} style={s.expItem} wrap={false}>
                    <View style={s.expRow}>
                      <Text style={s.expTitle}>{proj.name}</Text>
                      {proj.url ? <Text style={{ fontSize: 8, color: '#60a5fa' }}>{proj.url}</Text> : null}
                    </View>
                    {proj.description ? <Text style={s.expCompany}>{proj.description}</Text> : null}
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
            </View>
          )}

          {education.length > 0 && (
            <View>
              <View minPresenceAhead={120}>
                <Text style={[s.mSectionTitle, { marginTop: experience.length > 0 ? 14 : 0, color: accentColor }]}>{labels.education}</Text>
              </View>
              <View style={[s.mDivider, { borderBottomColor: accentColor }]} />
              {education.map((edu) => {
                const dateRange = [edu.startDate, edu.endDate].filter(Boolean).join(' - ');
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
            </View>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <View wrap={false}>
              <View minPresenceAhead={120}>
                <Text style={[s.mSectionTitle, { marginTop: 14, color: accentColor }]}>{labels.certifications}</Text>
              </View>
              <View style={[s.mDivider, { borderBottomColor: accentColor }]} />
              {data.certifications.map((cert, idx) => (
                <View
                  key={cert.id}
                  style={{
                    marginBottom: idx === data.certifications!.length - 1 ? 0 : 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ fontSize: 9, fontFamily: SANS, fontWeight: 700, color: accentColor }}>{cert.name}{cert.issuer ? ` · ${cert.issuer}` : ''}</Text>
                  {cert.date ? <Text style={{ fontSize: 8.5, color: '#6b7280' }}>{cert.date}</Text> : null}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
