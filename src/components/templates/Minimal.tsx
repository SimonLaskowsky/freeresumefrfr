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

const s = StyleSheet.create({
  page: {
    fontFamily: SANS, fontSize: 10,
    paddingTop: 40, paddingBottom: 52, paddingHorizontal: 64, color: '#111827',
  },
  name: { fontSize: 24, fontFamily: SANS, fontWeight: 700, marginBottom: 4, color: '#0f172a' },
  title: { fontSize: 11, color: '#64748b', marginBottom: 8 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', fontSize: 8.5, color: '#94a3b8', marginBottom: 22 },
  contactSep: { marginHorizontal: 6, color: '#cbd5e1' },

  sectionTitle: {
    fontSize: 7.5, fontFamily: SANS, fontWeight: 700, letterSpacing: 2,
    textTransform: 'uppercase', marginBottom: 4, marginTop: 18,
  },
  divider: { borderBottomWidth: 0.5, borderBottomColor: '#e2e8f0', marginBottom: 8 },

  expItem: { marginBottom: 10 },
  expRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  expTitle: { fontFamily: SANS, fontWeight: 700, fontSize: 10 },
  expDates: { fontSize: 8.5, color: '#9ca3af' },
  expCompany: { fontSize: 9.5, color: '#64748b', fontFamily: SANS, fontStyle: 'italic', marginBottom: 3 },
  bullet: { flexDirection: 'row', marginTop: 2, paddingLeft: 6 },
  bulletDash: { width: 10, color: '#d1d5db' },
  bulletText: { flex: 1, fontSize: 9.5, color: '#475569', lineHeight: 1.5 },

  eduItem: { marginBottom: 8 },
  eduRow: { flexDirection: 'row', justifyContent: 'space-between' },
  eduDegree: { fontFamily: SANS, fontWeight: 700, fontSize: 10 },
  eduDates: { fontSize: 8.5, color: '#9ca3af' },
  eduSchool: { fontSize: 9.5, color: '#64748b', fontFamily: SANS, fontStyle: 'italic', marginTop: 1 },
  eduNotes: { fontSize: 9, color: '#94a3b8', marginTop: 2 },

  skills: { fontSize: 9.5, color: '#475569', lineHeight: 1.6 },
  photo: { width: 72, height: 90, marginBottom: 12, objectFit: 'cover' },
});

export function MinimalTemplate({ data, labels, accentColor, companyLogo }: { data: ResumeData; labels: Labels; accentColor: string; companyLogo?: string }) {
  const { personal, experience, education, skills } = data;
  const contact: { text: string; url?: string }[] = [
    { text: personal.email }, { text: personal.phone }, { text: personal.location },
    { text: personal.linkedin }, { text: personal.website },
    ...(personal.links ?? []).map((l) => ({
      text: l.label || l.url,
      url: l.url.startsWith('http') ? l.url : `https://${l.url}`,
    })),
  ].filter((c) => Boolean(c.text));

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {companyLogo && (
          <View fixed style={{ position: 'absolute', bottom: 24, right: 24 }}>
            <Image src={companyLogo} style={{ width: 160, height: 160, opacity: 0.10, objectFit: 'contain' }} />
          </View>
        )}
        {personal.photo && <Image src={personal.photo} style={s.photo} />}
        {personal.name && <Text style={s.name}>{personal.name}</Text>}
        {personal.title && <Text style={s.title}>{personal.title}</Text>}
        {contact.length > 0 && (
          <View style={s.contactRow}>
            {contact.map((item, i) => (
              <View key={i} style={{ flexDirection: 'row' }}>
                {i > 0 && <Text style={s.contactSep}>·</Text>}
                {item.url
                  ? <Link src={item.url} style={{ color: '#94a3b8', textDecoration: 'underline' }}><Text>{item.text}</Text></Link>
                  : <Text>{item.text}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Summary */}
        {data.summary && (
          <View>
            <View minPresenceAhead={120}>
              <Text style={[s.sectionTitle, { marginTop: 0, color: accentColor }]}>{labels.summary}</Text>
            </View>
            <View style={s.divider} />
            <Text style={{ fontSize: 9.5, color: '#475569', lineHeight: 1.5 }}>{data.summary}</Text>
          </View>
        )}

        {experience.length > 0 && (
          <View>
            <View minPresenceAhead={120}>
              <Text style={[s.sectionTitle, { color: accentColor }]}>{labels.experience}</Text>
            </View>
            <View style={s.divider} />
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
                      <Text style={s.bulletDash}>-</Text>
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
              <Text style={[s.sectionTitle, { marginTop: 18, color: accentColor }]}>{labels.projects}</Text>
            </View>
            <View style={s.divider} />
            {data.projects.map((proj) => {
              const bullets = (proj.bullets || []).filter((b) => b.trim());
              return (
                <View key={proj.id} style={s.expItem} wrap={false}>
                  <View style={s.expRow}>
                    <Text style={s.expTitle}>{proj.name}</Text>
                    {proj.url ? <Text style={{ fontSize: 8.5, color: accentColor }}>{proj.url}</Text> : null}
                  </View>
                  {proj.description ? <Text style={s.expCompany}>{proj.description}</Text> : null}
                  {bullets.map((b, i) => (
                    <View key={i} style={s.bullet}>
                      <Text style={s.bulletDash}>-</Text>
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
              <Text style={[s.sectionTitle, { marginTop: experience.length > 0 ? 18 : 20, color: accentColor }]}>{labels.education}</Text>
            </View>
            <View style={s.divider} />
            {education.map((edu) => {
              const dateRange = [edu.startDate, edu.endDate].filter(Boolean).join(' - ');
              return (
                <View key={edu.id} style={s.eduItem} wrap={false}>
                  <View style={s.eduRow}>
                    <Text style={s.eduDegree}>{edu.degree}</Text>
                    {dateRange && <Text style={s.eduDates}>{dateRange}</Text>}
                  </View>
                  {edu.school && <Text style={s.eduSchool}>{edu.school}</Text>}
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
              <Text style={[s.sectionTitle, { marginTop: 18, color: accentColor }]}>{labels.certifications}</Text>
            </View>
            <View style={s.divider} />
            {data.certifications.map((cert, idx) => (
              <View
                key={cert.id}
                style={{
                  marginBottom: idx === data.certifications!.length - 1 ? 0 : 4,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ fontSize: 9.5, fontFamily: SANS, fontWeight: 700, color: '#0f172a' }}>{cert.name}{cert.issuer ? ` · ${cert.issuer}` : ''}</Text>
                {cert.date ? <Text style={{ fontSize: 8.5, color: '#9ca3af' }}>{cert.date}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {data.languages && data.languages.length > 0 && (
          <View wrap={false}>
            <View minPresenceAhead={120}>
              <Text style={[s.sectionTitle, { marginTop: 18, color: accentColor }]}>{labels.languages}</Text>
            </View>
            <View style={s.divider} />
            {(data.languages ?? []).map((lang, idx) => (
              <View key={lang.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: idx === (data.languages ?? []).length - 1 ? 0 : 3 }}>
                <Text style={{ fontSize: 9.5, fontFamily: SANS, fontWeight: 700 }}>{lang.name}</Text>
                {lang.level ? <Text style={{ fontSize: 9, color: '#6b7280' }}>{lang.level}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {skills && (
          <View wrap={false}>
            <View minPresenceAhead={120}>
              <Text style={[s.sectionTitle, { marginTop: 18, color: accentColor }]}>{labels.skills}</Text>
            </View>
            <View style={s.divider} />
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
          </View>
        )}
      </Page>
    </Document>
  );
}
