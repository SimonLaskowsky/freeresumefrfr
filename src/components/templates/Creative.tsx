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
  page: { flexDirection: 'row', fontFamily: SANS, fontSize: 9.5, color: '#1a1a1a' },
  left: { width: '38%', paddingTop: 36, paddingBottom: 36, paddingHorizontal: 18 },
  right: { flex: 1, paddingTop: 36, paddingBottom: 36, paddingHorizontal: 22, backgroundColor: '#ffffff' },

  lName: { fontSize: 20, fontFamily: SANS, fontWeight: 700, color: '#ffffff', marginBottom: 4, lineHeight: 1.2 },
  lTitle: { fontSize: 9.5, color: '#ffffff', opacity: 0.8, marginBottom: 18, fontFamily: SANS, fontStyle: 'italic' },
  lSectionTitle: { fontSize: 7, fontFamily: SANS, fontWeight: 700, letterSpacing: 1.5, color: '#ffffff', opacity: 0.7, textTransform: 'uppercase', marginTop: 16, marginBottom: 6 },
  lRule: { borderBottomWidth: 0.5, borderBottomColor: '#ffffff', opacity: 0.25, marginBottom: 8 },
  lItem: { fontSize: 8.5, color: '#ffffff', marginBottom: 4, lineHeight: 1.4 },
  lSkillChip: { fontSize: 8, color: '#ffffff', marginBottom: 3, paddingVertical: 2, paddingHorizontal: 4, borderWidth: 0.5, borderColor: '#ffffff', borderRadius: 3 },

  rSectionTitle: { fontSize: 8.5, fontFamily: SANS, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2, marginTop: 14 },
  rDivider: { borderBottomWidth: 1, marginBottom: 7 },

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
  photo: { width: '100%', height: 220, borderRadius: 3, marginBottom: 16, objectFit: 'cover' },
});

export function CreativeTemplate({ data, labels, accentColor, companyLogo }: Props) {
  const { personal, experience, education, skills } = data;
  const contact = [personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean);
  const skillList = skills.split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {companyLogo && (
          <View style={{ position: 'absolute', bottom: 24, right: 24 }}>
            <Image src={companyLogo} style={{ width: 160, height: 160, opacity: 0.10, objectFit: 'contain' }} />
          </View>
        )}
        {/* Left accent panel */}
        <View style={[s.left, { backgroundColor: accentColor }]}>
          {personal.photo && <Image src={personal.photo} style={s.photo} />}
          {personal.name && <Text style={s.lName}>{personal.name}</Text>}
          {personal.title && <Text style={s.lTitle}>{personal.title}</Text>}
          {contact.length > 0 && (
            <View wrap={false}>
              <Text style={s.lSectionTitle}>{labels.contact}</Text>
              <View style={s.lRule} />
              {contact.map((item, i) => <Text key={i} style={s.lItem}>{item}</Text>)}
            </View>
          )}
          {skillList.length > 0 && (
            <View wrap={false}>
              <Text style={s.lSectionTitle}>{labels.skills}</Text>
              <View style={s.lRule} />
              {skillList.map((skill, i) => (
                <View key={i} style={{ marginBottom: 3 }}>
                  <Text style={s.lItem}>{skill}</Text>
                </View>
              ))}
            </View>
          )}
          {data.languages && data.languages.length > 0 && (
            <View wrap={false}>
              <Text style={s.lSectionTitle}>{labels.languages}</Text>
              <View style={s.lRule} />
              {(data.languages ?? []).map((lang) => (
                <Text key={lang.id} style={s.lItem}>{lang.name}{lang.level ? ` — ${lang.level}` : ''}</Text>
              ))}
            </View>
          )}
        </View>

        {/* Right content panel */}
        <View style={s.right}>
          {data.summary && (
            <View>
              <View minPresenceAhead={60}>
                <Text style={[s.rSectionTitle, { color: accentColor, marginTop: 0 }]}>{labels.summary}</Text>
              </View>
              <View style={[s.rDivider, { borderBottomColor: accentColor }]} />
              <Text style={{ fontSize: 9, color: '#374151', lineHeight: 1.5, marginBottom: 8 }}>{data.summary}</Text>
            </View>
          )}

          {experience.length > 0 && (
            <View>
              <View minPresenceAhead={60}>
                <Text style={[s.rSectionTitle, { color: accentColor }]}>{labels.experience}</Text>
              </View>
              <View style={[s.rDivider, { borderBottomColor: accentColor }]} />
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
            </View>
          )}

          {data.projects && data.projects.length > 0 && (
            <View wrap={false}>
              <View minPresenceAhead={60}>
                <Text style={[s.rSectionTitle, { color: accentColor }]}>{labels.projects}</Text>
              </View>
              <View style={[s.rDivider, { borderBottomColor: accentColor }]} />
              {data.projects.map((proj) => {
                const bullets = (proj.bullets || []).filter((b) => b.trim());
                return (
                  <View key={proj.id} style={s.expItem} wrap={false}>
                    <View style={s.expRow}>
                      <Text style={s.expTitle}>{proj.name}</Text>
                      {proj.url && <Text style={{ fontSize: 8, color: accentColor }}>{proj.url}</Text>}
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
            </View>
          )}

          {education.length > 0 && (
            <View wrap={false}>
              <View minPresenceAhead={60}>
                <Text style={[s.rSectionTitle, { color: accentColor }]}>{labels.education}</Text>
              </View>
              <View style={[s.rDivider, { borderBottomColor: accentColor }]} />
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
            </View>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <View wrap={false}>
              <View minPresenceAhead={60}>
                <Text style={[s.rSectionTitle, { color: accentColor }]}>{labels.certifications}</Text>
              </View>
              <View style={[s.rDivider, { borderBottomColor: accentColor }]} />
              {data.certifications.map((cert, idx) => (
                <View
                  key={cert.id}
                  style={{
                    marginBottom: idx === data.certifications!.length - 1 ? 0 : 4,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ fontSize: 9, fontFamily: SANS, fontWeight: 700 }}>{cert.name}{cert.issuer ? ` · ${cert.issuer}` : ''}</Text>
                  {cert.date && <Text style={{ fontSize: 8.5, color: '#6b7280' }}>{cert.date}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
