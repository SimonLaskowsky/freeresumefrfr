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

const TEAL = '#0891b2';

const s = StyleSheet.create({
  page: {
    fontFamily: SANS, fontSize: 10,
    paddingTop: 40, paddingBottom: 40, paddingHorizontal: 50, color: '#1a1a1a',
  },

  header: { marginBottom: 14 },
  name: { fontSize: 22, fontFamily: SANS, fontWeight: 700, color: '#0c1a2e', marginBottom: 2 },
  title: { fontSize: 11, color: TEAL, fontFamily: SANS, fontWeight: 700, marginBottom: 8 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', fontSize: 8.5, color: '#4b5563' },
  contactSep: { marginHorizontal: 5, color: '#9ca3af' },

  headerRule: { borderBottomWidth: 1.5, borderBottomColor: TEAL, marginTop: 10 },

  sectionBlock: { flexDirection: 'row', marginTop: 14 },
  sectionBorder: { width: 3, backgroundColor: TEAL, marginRight: 10 },
  sectionContent: { flex: 1 },
  sectionTitle: {
    fontSize: 8.5, fontFamily: SANS, fontWeight: 700, letterSpacing: 1,
    color: TEAL, textTransform: 'uppercase', marginBottom: 8,
  },

  expItem: { marginBottom: 8 },
  expRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  expTitle: { fontFamily: SANS, fontWeight: 700, fontSize: 10 },
  expDates: { fontSize: 8.5, color: '#6b7280' },
  expCompany: { fontSize: 9.5, color: '#4b5563', marginBottom: 2 },
  bullet: { flexDirection: 'row', marginTop: 1.5, paddingLeft: 4 },
  bulletDot: { width: 10, color: TEAL },
  bulletText: { flex: 1, fontSize: 9.5, color: '#374151', lineHeight: 1.4 },

  eduItem: { marginBottom: 6 },
  eduRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  eduDegree: { fontFamily: SANS, fontWeight: 700, fontSize: 10 },
  eduDates: { fontSize: 8.5, color: '#6b7280' },
  eduSchool: { fontSize: 9.5, color: '#4b5563' },
  eduNotes: { fontSize: 8.5, color: '#6b7280', marginTop: 1 },

  skills: { fontSize: 9.5, color: '#374151', lineHeight: 1.5 },
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.sectionBlock}>
      <View style={s.sectionBorder} />
      <View style={s.sectionContent}>
        <Text style={s.sectionTitle}>{title}</Text>
        {children}
      </View>
    </View>
  );
}

export function ProTemplate({ data, labels }: { data: ResumeData; labels: Labels }) {
  const { personal, experience, education, skills } = data;
  const contact = [personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean);

  return (
    <Document>
      <Page size={data.pageSize || 'LETTER'} style={s.page}>
        <View style={s.header}>
          {personal.name && <Text style={s.name}>{personal.name}</Text>}
          {personal.title && <Text style={s.title}>{personal.title}</Text>}
          {contact.length > 0 && (
            <View style={s.contactRow}>
              {contact.map((item, i) => (
                <View key={i} style={{ flexDirection: 'row' }}>
                  {i > 0 && <Text style={s.contactSep}>|</Text>}
                  <Text>{item}</Text>
                </View>
              ))}
            </View>
          )}
          <View style={s.headerRule} />
        </View>

        {data.summary && (
          <Section title={labels.summary}>
            <Text style={s.skills}>{data.summary}</Text>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title={labels.experience}>
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
                      <Text style={s.bulletDot}>•</Text>
                      <Text style={s.bulletText}>{b.trim()}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </Section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <Section title={labels.projects}>
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
                      <Text style={s.bulletDot}>•</Text>
                      <Text style={s.bulletText}>{b.trim()}</Text>
                    </View>
                  ))}
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
          </Section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <Section title={labels.certifications}>
            {data.certifications.map((cert) => (
              <View key={cert.id} style={{ marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 9.5, fontFamily: SANS, fontWeight: 700, color: '#0c1a2e' }}>{cert.name}{cert.issuer ? ` · ${cert.issuer}` : ''}</Text>
                {cert.date ? <Text style={{ fontSize: 8.5, color: '#6b7280' }}>{cert.date}</Text> : null}
              </View>
            ))}
          </Section>
        )}

        {skills && (
          <Section title={labels.skills}>
            <Text style={s.skills}>{skills}</Text>
          </Section>
        )}
      </Page>
    </Document>
  );
}
