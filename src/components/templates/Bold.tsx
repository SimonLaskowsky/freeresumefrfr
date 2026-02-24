import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { SANS } from './fonts';
import type { ResumeData } from '@/store/resumeStore';

interface Labels {
  summary: string;
  experience: string;
  education: string;
  skills: string;
  projects: string;
  certifications: string;
  contact: string;
}

const HEADER_BG = '#0f172a';
const LIME = '#a3e635';

const s = StyleSheet.create({
  page: { fontFamily: SANS, fontSize: 10, color: '#1a1a1a', paddingBottom: 40 },

  header: { backgroundColor: HEADER_BG, paddingTop: 30, paddingBottom: 26, paddingHorizontal: 48 },
  name: { fontSize: 26, fontFamily: SANS, fontWeight: 700, color: '#ffffff', marginBottom: 4, letterSpacing: 0.2 },
  titleLine: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  accentBar: { width: 3, height: 14, backgroundColor: LIME, marginRight: 8 },
  titleText: { fontSize: 11, color: LIME, fontFamily: SANS, fontWeight: 700 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', fontSize: 8.5, color: '#94a3b8' },
  contactSep: { marginHorizontal: 6, color: '#334155' },

  body: { paddingHorizontal: 48, paddingTop: 6 },

  sectionTitle: {
    fontSize: 9, fontFamily: SANS, fontWeight: 700, letterSpacing: 1.2,
    color: '#0f172a', textTransform: 'uppercase', marginTop: 18, marginBottom: 4,
    paddingBottom: 4, borderBottomWidth: 2, borderBottomColor: LIME,
  },

  expItem: { marginBottom: 9 },
  expRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  expTitle: { fontFamily: SANS, fontWeight: 700, fontSize: 10.5 },
  expDates: { fontSize: 8.5, color: '#6b7280' },
  expCompany: { fontSize: 9.5, color: '#4b5563', marginBottom: 2 },
  bullet: { flexDirection: 'row', marginTop: 2, paddingLeft: 6 },
  bulletDot: { width: 10, color: LIME, fontFamily: SANS, fontWeight: 700 },
  bulletText: { flex: 1, fontSize: 9.5, color: '#374151', lineHeight: 1.4 },

  eduItem: { marginBottom: 7 },
  eduRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  eduDegree: { fontFamily: SANS, fontWeight: 700, fontSize: 10.5 },
  eduDates: { fontSize: 8.5, color: '#6b7280' },
  eduSchool: { fontSize: 9.5, color: '#4b5563' },
  eduNotes: { fontSize: 9, color: '#6b7280', marginTop: 1 },

  skills: { fontSize: 9.5, color: '#374151', lineHeight: 1.5 },
});

export function BoldTemplate({ data, labels }: { data: ResumeData; labels: Labels }) {
  const { personal, experience, education, skills } = data;
  const contact = [personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean);

  return (
    <Document>
      <Page size={data.pageSize || 'LETTER'} style={s.page}>
        <View style={s.header}>
          {personal.name && <Text style={s.name}>{personal.name}</Text>}
          {personal.title && (
            <View style={s.titleLine}>
              <View style={s.accentBar} />
              <Text style={s.titleText}>{personal.title}</Text>
            </View>
          )}
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

        <View style={s.body}>
          {/* Summary */}
          {data.summary && (
            <View>
              <Text style={s.sectionTitle}>{labels.summary}</Text>
              <Text style={{ fontSize: 9.5, color: '#374151', lineHeight: 1.5 }}>{data.summary}</Text>
            </View>
          )}

          {experience.length > 0 && (
            <View>
              <Text style={s.sectionTitle}>{labels.experience}</Text>
              {experience.map((exp) => {
                const bullets = (exp.bullets || []).filter((b) => b.trim());
                const dateRange = exp.current
                  ? `${exp.startDate} – Present`
                  : [exp.startDate, exp.endDate].filter(Boolean).join(' – ');
                return (
                  <View key={exp.id} style={s.expItem}>
                    <View style={s.expRow}>
                      <Text style={s.expTitle}>{[exp.title, exp.company].filter(Boolean).join(' · ')}</Text>
                      {dateRange && <Text style={s.expDates}>{dateRange}</Text>}
                    </View>
                    {bullets.map((b, i) => (
                      <View key={i} style={s.bullet}>
                        <Text style={s.bulletDot}>▸</Text>
                        <Text style={s.bulletText}>{b.trim()}</Text>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <View>
              <Text style={s.sectionTitle}>{labels.projects}</Text>
              {data.projects.map((proj) => {
                const bullets = (proj.bullets || []).filter((b) => b.trim());
                return (
                  <View key={proj.id} style={s.expItem}>
                    <View style={s.expRow}>
                      <Text style={s.expTitle}>{proj.name}</Text>
                      {proj.url ? <Text style={{ fontSize: 8.5, color: '#0891b2' }}>{proj.url}</Text> : null}
                    </View>
                    {proj.description ? <Text style={s.expCompany}>{proj.description}</Text> : null}
                    {bullets.map((b, i) => (
                      <View key={i} style={s.bullet}>
                        <Text style={s.bulletDot}>▸</Text>
                        <Text style={s.bulletText}>{b.trim()}</Text>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          )}

          {education.length > 0 && (
            <View>
              <Text style={s.sectionTitle}>{labels.education}</Text>
              {education.map((edu) => {
                const dateRange = [edu.startDate, edu.endDate].filter(Boolean).join(' – ');
                return (
                  <View key={edu.id} style={s.eduItem}>
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
            <View>
              <Text style={s.sectionTitle}>{labels.certifications}</Text>
              {data.certifications.map((cert) => (
                <View key={cert.id} style={{ marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 9.5, fontFamily: SANS, fontWeight: 700, color: '#0f172a' }}>{cert.name}{cert.issuer ? ` · ${cert.issuer}` : ''}</Text>
                  {cert.date ? <Text style={{ fontSize: 8.5, color: '#6b7280' }}>{cert.date}</Text> : null}
                </View>
              ))}
            </View>
          )}

          {skills && (
            <View>
              <Text style={s.sectionTitle}>{labels.skills}</Text>
              <Text style={s.skills}>{skills}</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
