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

const s = StyleSheet.create({
  page: {
    fontFamily: SANS, fontSize: 10,
    paddingTop: 52, paddingBottom: 52, paddingHorizontal: 64, color: '#111827',
  },
  name: { fontSize: 24, fontFamily: SANS, fontWeight: 700, marginBottom: 4, color: '#0f172a' },
  title: { fontSize: 11, color: '#64748b', marginBottom: 8 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', fontSize: 8.5, color: '#94a3b8', marginBottom: 22 },
  contactSep: { marginHorizontal: 6, color: '#cbd5e1' },

  sectionTitle: {
    fontSize: 7.5, fontFamily: SANS, fontWeight: 700, letterSpacing: 2,
    color: '#94a3b8', textTransform: 'uppercase', marginBottom: 10, marginTop: 20,
  },
  divider: { borderBottomWidth: 0.5, borderBottomColor: '#e2e8f0', marginBottom: 10 },

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
});

export function MinimalTemplate({ data, labels }: { data: ResumeData; labels: Labels }) {
  const { personal, experience, education, skills } = data;
  const contact = [personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean);

  return (
    <Document>
      <Page size={data.pageSize || 'LETTER'} style={s.page}>
        {personal.name && <Text style={s.name}>{personal.name}</Text>}
        {personal.title && <Text style={s.title}>{personal.title}</Text>}
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

        {/* Summary */}
        {data.summary && (
          <View>
            <Text style={[s.sectionTitle, { marginTop: 0 }]}>{labels.summary}</Text>
            <View style={s.divider} />
            <Text style={{ fontSize: 9.5, color: '#475569', lineHeight: 1.5 }}>{data.summary}</Text>
          </View>
        )}

        {experience.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>{labels.experience}</Text>
            <View style={s.divider} />
            {experience.map((exp) => {
              const bullets = (exp.bullets || []).filter((b) => b.trim());
              const dateRange = exp.current
                ? `${exp.startDate} – Present`
                : [exp.startDate, exp.endDate].filter(Boolean).join(' – ');
              return (
                <View key={exp.id} style={s.expItem}>
                  <View style={s.expRow}>
                    <Text style={s.expTitle}>{exp.title}</Text>
                    {dateRange && <Text style={s.expDates}>{dateRange}</Text>}
                  </View>
                  {exp.company && <Text style={s.expCompany}>{exp.company}</Text>}
                  {bullets.map((b, i) => (
                    <View key={i} style={s.bullet}>
                      <Text style={s.bulletDash}>–</Text>
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
            <Text style={[s.sectionTitle, { marginTop: 18 }]}>{labels.projects}</Text>
            <View style={s.divider} />
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
                      <Text style={s.bulletDash}>–</Text>
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
            <Text style={[s.sectionTitle, { marginTop: experience.length > 0 ? 18 : 20 }]}>{labels.education}</Text>
            <View style={s.divider} />
            {education.map((edu) => {
              const dateRange = [edu.startDate, edu.endDate].filter(Boolean).join(' – ');
              return (
                <View key={edu.id} style={s.eduItem}>
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
          <View>
            <Text style={[s.sectionTitle, { marginTop: 18 }]}>{labels.certifications}</Text>
            <View style={s.divider} />
            {data.certifications.map((cert) => (
              <View key={cert.id} style={{ marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 9.5, fontFamily: SANS, fontWeight: 700, color: '#0f172a' }}>{cert.name}{cert.issuer ? ` · ${cert.issuer}` : ''}</Text>
                {cert.date ? <Text style={{ fontSize: 8.5, color: '#9ca3af' }}>{cert.date}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {skills && (
          <View>
            <Text style={[s.sectionTitle, { marginTop: 18 }]}>{labels.skills}</Text>
            <View style={s.divider} />
            <Text style={s.skills}>{skills}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
