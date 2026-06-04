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
    fontFamily: SANS, fontSize: 9,
    paddingTop: 32, paddingBottom: 32, paddingHorizontal: 44, color: '#1a1a1a',
  },
  name: { fontSize: 20, fontFamily: SANS, fontWeight: 700, marginBottom: 2, letterSpacing: 0.2 },
  title: { fontSize: 10, color: '#4b5563', marginBottom: 3 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', fontSize: 8, color: '#6b7280' },
  contactSep: { marginHorizontal: 4, color: '#d1d5db' },

  divider: { borderBottomWidth: 1, marginTop: 8, marginBottom: 4 },
  sectionTitle: {
    fontSize: 8, fontFamily: SANS, fontWeight: 700, letterSpacing: 1.2,
    textTransform: 'uppercase', marginBottom: 4, marginTop: 3,
  },

  expItem: { marginBottom: 6 },
  expRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 0.5 },
  expTitleCompany: { fontFamily: SANS, fontWeight: 700, fontSize: 9.5 },
  expDates: { fontSize: 8, color: '#6b7280' },
  bullet: { flexDirection: 'row', marginTop: 1, paddingLeft: 4 },
  bulletDot: { width: 8, color: '#555', fontSize: 9 },
  bulletText: { flex: 1, fontSize: 8.5, color: '#374151', lineHeight: 1.35 },

  eduItem: { marginBottom: 5 },
  eduRow: { flexDirection: 'row', justifyContent: 'space-between' },
  eduDegreeSchool: { fontFamily: SANS, fontWeight: 700, fontSize: 9.5 },
  eduDates: { fontSize: 8, color: '#6b7280' },
  eduNotes: { fontSize: 8.5, color: '#6b7280', marginTop: 0.5 },

  skills: { fontSize: 8.5, color: '#374151', lineHeight: 1.4 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start' },
  headerText: { flex: 1 },
  photo: { width: 56, height: 70, borderRadius: 2, marginRight: 14, marginTop: 1, objectFit: 'cover' },
});

export function CompactTemplate({ data, labels, accentColor, companyLogo }: { data: ResumeData; labels: Labels; accentColor: string; companyLogo?: string }) {
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
        <View style={s.headerRow}>
          {personal.photo && <Image src={personal.photo} style={s.photo} />}
          <View style={s.headerText}>
            {personal.name && <Text style={s.name}>{personal.name}</Text>}
            {personal.title && <Text style={s.title}>{personal.title}</Text>}
            {contact.length > 0 && (
              <View style={s.contactRow}>
                {contact.map((item, i) => (
                  <View key={i} style={{ flexDirection: 'row' }}>
                    {i > 0 && <Text style={s.contactSep}>·</Text>}
                    {item.url
                      ? <Link src={item.url} style={{ color: '#6b7280', textDecoration: 'underline' }}><Text>{item.text}</Text></Link>
                      : <Text>{item.text}</Text>}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Summary */}
        {data.summary && (
          <View>
            <View minPresenceAhead={60}>
              <View style={[s.divider, { borderBottomColor: accentColor }]} />
            <Text style={[s.sectionTitle, { color: accentColor }]}>{labels.summary}</Text>
            </View>
            <Text style={{ fontSize: 8.5, color: '#374151', lineHeight: 1.4 }}>{data.summary}</Text>
          </View>
        )}

        {experience.length > 0 && (
          <View>
            <View minPresenceAhead={60}>
              <View style={[s.divider, { borderBottomColor: accentColor }]} />
            <Text style={[s.sectionTitle, { color: accentColor }]}>{labels.experience}</Text>
            </View>
            {experience.map((exp) => {
              const bullets = (exp.bullets || []).filter((b) => b.trim());
              const dateRange = exp.current
                ? `${exp.startDate} – ${labels.present}`
                : [exp.startDate, exp.endDate].filter(Boolean).join(' – ');
              return (
                <View key={exp.id} style={s.expItem} wrap={false}>
                  <View style={s.expRow}>
                    <Text style={s.expTitleCompany}>
                      {[exp.title, exp.company].filter(Boolean).join(' · ')}
                    </Text>
                    {dateRange && <Text style={s.expDates}>{dateRange}</Text>}
                  </View>
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
            <View minPresenceAhead={60}>
              <View style={[s.divider, { borderBottomColor: accentColor }]} />
            <Text style={[s.sectionTitle, { color: accentColor }]}>{labels.projects}</Text>
            </View>
            {data.projects.map((proj) => {
              const bullets = (proj.bullets || []).filter((b) => b.trim());
              return (
                <View key={proj.id} style={s.expItem} wrap={false}>
                  <View style={s.expRow}>
                    <Text style={s.expTitleCompany}>{proj.name}</Text>
                    {proj.url ? <Text style={{ fontSize: 7.5, color: accentColor }}>{proj.url}</Text> : null}
                  </View>
                  {proj.description ? <Text style={{ fontSize: 8, color: '#4b5563', marginBottom: 1 }}>{proj.description}</Text> : null}
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
            <View minPresenceAhead={60}>
              <View style={[s.divider, { borderBottomColor: accentColor }]} />
            <Text style={[s.sectionTitle, { color: accentColor }]}>{labels.education}</Text>
            </View>
            {education.map((edu) => {
              const dateRange = [edu.startDate, edu.endDate].filter(Boolean).join(' – ');
              return (
                <View key={edu.id} style={s.eduItem} wrap={false}>
                  <View style={s.eduRow}>
                    <Text style={s.eduDegreeSchool}>{[edu.degree, edu.school].filter(Boolean).join(' · ')}</Text>
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
            <View minPresenceAhead={60}>
              <View style={[s.divider, { borderBottomColor: accentColor }]} />
            <Text style={[s.sectionTitle, { color: accentColor }]}>{labels.certifications}</Text>
            </View>
            {data.certifications.map((cert, idx) => (
              <View
                key={cert.id}
                style={{
                  marginBottom: idx === data.certifications!.length - 1 ? 0 : 3,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ fontSize: 8.5, fontFamily: SANS, fontWeight: 700 }}>{cert.name}{cert.issuer ? ` · ${cert.issuer}` : ''}</Text>
                {cert.date ? <Text style={{ fontSize: 8, color: '#6b7280' }}>{cert.date}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {data.languages && data.languages.length > 0 && (
          <View wrap={false}>
            <View minPresenceAhead={60}>
              <View style={[s.divider, { borderBottomColor: accentColor }]} />
              <Text style={[s.sectionTitle, { color: accentColor }]}>{labels.languages}</Text>
            </View>
            {(data.languages ?? []).map((lang, idx) => (
              <View key={lang.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: idx === (data.languages ?? []).length - 1 ? 0 : 3 }}>
                <Text style={{ fontSize: 8.5, fontFamily: SANS, fontWeight: 700 }}>{lang.name}</Text>
                {lang.level ? <Text style={{ fontSize: 8, color: '#6b7280' }}>{lang.level}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {skills && (
          <View>
            <View minPresenceAhead={60}>
              <View style={[s.divider, { borderBottomColor: accentColor }]} />
            <Text style={[s.sectionTitle, { color: accentColor }]}>{labels.skills}</Text>
            </View>
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
