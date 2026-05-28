import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { SERIF } from './fonts';
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
    fontFamily: SERIF, fontSize: 10,
    paddingTop: 40, paddingBottom: 46, paddingHorizontal: 58, color: '#1a1a1a',
  },
  header: { alignItems: 'center', marginBottom: 14 },
  name: { fontSize: 24, fontFamily: SERIF, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 },
  title: { fontSize: 11, fontFamily: SERIF, fontStyle: 'italic', color: '#555555', marginBottom: 10 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', fontSize: 8.5, color: '#666666' },
  contactSep: { marginHorizontal: 5, color: '#bbbbbb' },

  rule: { borderBottomWidth: 0.75, marginBottom: 4 },
  thinRule: { borderBottomWidth: 0.25, borderBottomColor: '#cccccc', marginBottom: 6 },

  sectionTitle: {
    fontSize: 9, fontFamily: SERIF, fontWeight: 700, letterSpacing: 2,
    textTransform: 'uppercase', textAlign: 'center',
    marginBottom: 4, marginTop: 14, color: '#333333',
  },

  expItem: { marginBottom: 8 },
  expRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  expTitle: { fontFamily: SERIF, fontWeight: 700, fontSize: 10.5 },
  expDates: { fontSize: 9, color: '#777777', fontFamily: SERIF, fontStyle: 'italic' },
  expCompany: { fontSize: 10, fontFamily: SERIF, fontStyle: 'italic', color: '#555555', marginBottom: 3 },
  bullet: { flexDirection: 'row', marginTop: 2, paddingLeft: 8 },
  bulletDot: { width: 10, color: '#999999' },
  bulletText: { flex: 1, fontSize: 9.5, color: '#333333', lineHeight: 1.5 },

  eduItem: { alignItems: 'center', marginBottom: 8 },
  eduDegree: { fontFamily: SERIF, fontWeight: 700, fontSize: 10.5 },
  eduSchool: { fontFamily: SERIF, fontStyle: 'italic', fontSize: 10, color: '#555555', marginTop: 1 },
  eduDates: { fontSize: 9, color: '#777777', marginTop: 1 },
  eduNotes: { fontSize: 9, color: '#777777', fontFamily: SERIF, fontStyle: 'italic', marginTop: 1 },

  skills: { fontSize: 9.5, color: '#444444', lineHeight: 1.6, textAlign: 'center' },
  photo: { width: 64, height: 80, borderRadius: 1, marginBottom: 12, objectFit: 'cover' },
});

export function ElegantTemplate({ data, labels, accentColor, companyLogo }: { data: ResumeData; labels: Labels; accentColor: string; companyLogo?: string }) {
  const { personal, experience, education, skills } = data;
  const contact = [personal.email, personal.phone, personal.location, personal.linkedin, personal.website, ...(personal.links ?? []).map((l) => l.label || l.url)].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {companyLogo && (
          <View style={{ position: 'absolute', bottom: 24, right: 24 }}>
            <Image src={companyLogo} style={{ width: 160, height: 160, opacity: 0.10, objectFit: 'contain' }} />
          </View>
        )}
        <View style={s.header}>
          {personal.photo && <Image src={personal.photo} style={s.photo} />}
          {personal.name && <Text style={s.name}>{personal.name}</Text>}
          {personal.title && <Text style={s.title}>{personal.title}</Text>}
          {contact.length > 0 && (
            <View style={s.contactRow}>
              {contact.map((item, i) => (
                <View key={i} style={{ flexDirection: 'row' }}>
                  {i > 0 && <Text style={s.contactSep}>✦</Text>}
                  <Text>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={[s.rule, { borderBottomColor: accentColor }]} />

        {/* Summary */}
        {data.summary && (
          <View>
            <View minPresenceAhead={60}>
              <Text style={s.sectionTitle}>{labels.summary}</Text>
            </View>
            <View style={s.thinRule} />
            <Text style={{ fontSize: 9.5, color: '#333333', lineHeight: 1.6, textAlign: 'center' }}>{data.summary}</Text>
          </View>
        )}

        {experience.length > 0 && (
          <View>
            <View minPresenceAhead={60}>
              <Text style={s.sectionTitle}>{labels.experience}</Text>
            </View>
            <View style={s.thinRule} />
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

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <View wrap={false}>
            <View minPresenceAhead={60}>
              <Text style={[s.sectionTitle, { marginTop: 12 }]}>{labels.projects}</Text>
            </View>
            <View style={s.thinRule} />
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
              <Text style={[s.sectionTitle, { marginTop: experience.length > 0 ? 12 : 14 }]}>{labels.education}</Text>
            </View>
            <View style={s.thinRule} />
            {education.map((edu) => {
              const dateRange = [edu.startDate, edu.endDate].filter(Boolean).join(' – ');
              return (
                <View key={edu.id} style={s.eduItem} wrap={false}>
                  {edu.degree && <Text style={s.eduDegree}>{edu.degree}</Text>}
                  {edu.school && <Text style={s.eduSchool}>{edu.school}</Text>}
                  {dateRange && <Text style={s.eduDates}>{dateRange}</Text>}
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
              <Text style={[s.sectionTitle, { marginTop: 12 }]}>{labels.certifications}</Text>
            </View>
            <View style={s.thinRule} />
            {data.certifications.map((cert, idx) => (
              <View
                key={cert.id}
                style={{
                  marginBottom: idx === data.certifications!.length - 1 ? 0 : 4,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 9.5, fontFamily: SERIF, fontWeight: 700 }}>{cert.name}{cert.issuer ? ` · ${cert.issuer}` : ''}</Text>
                {cert.date ? <Text style={{ fontSize: 9, color: '#777777', fontFamily: SERIF, fontStyle: 'italic' }}>{cert.date}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {data.languages && data.languages.length > 0 && (
          <View wrap={false}>
            <View minPresenceAhead={60}>
              <Text style={[s.sectionTitle, { marginTop: 12 }]}>{labels.languages}</Text>
            </View>
            <View style={s.thinRule} />
            {(data.languages ?? []).map((lang, idx) => (
              <View key={lang.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: idx === (data.languages ?? []).length - 1 ? 0 : 3 }}>
                <Text style={{ fontSize: 9.5, fontFamily: SERIF, fontWeight: 700 }}>{lang.name}</Text>
                {lang.level ? <Text style={{ fontSize: 9, color: '#6b7280' }}>{lang.level}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {skills && (
          <View>
            <View minPresenceAhead={60}>
              <Text style={[s.sectionTitle, { marginTop: 12 }]}>{labels.skills}</Text>
            </View>
            <View style={s.thinRule} />
            {data.skillGroups && data.skillGroups.length > 0 ? (
              <View>
                {data.skillGroups.map((group, idx) => (
                  <View key={group.id} style={{ marginBottom: idx < data.skillGroups!.length - 1 ? 5 : 0 }}>
                    {group.category ? <Text style={{ fontSize: 7.5, fontFamily: SERIF, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: accentColor, marginBottom: 2 }}>{group.category}</Text> : null}
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
