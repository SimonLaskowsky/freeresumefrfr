import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { SANS } from './fonts';
import type { ResumeData } from '@/store/resumeStore';

interface Props {
  data: ResumeData;
  labels: { summary: string; experience: string; education: string; skills: string; projects: string; certifications: string; contact: string; present: string; };
  accentColor: string;
  companyLogo?: string;
}

const s = StyleSheet.create({
  page: { fontFamily: SANS, fontSize: 10, paddingTop: 46, paddingBottom: 46, paddingHorizontal: 56, color: '#1a1a1a' },
  header: { alignItems: 'flex-end', marginBottom: 4 },
  name: { fontSize: 26, fontFamily: SANS, fontWeight: 700, letterSpacing: 0.5, textAlign: 'right', marginBottom: 3 },
  title: { fontSize: 11, color: '#555555', textAlign: 'right', marginBottom: 6 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', fontSize: 8.5, color: '#777777' },
  contactSep: { marginHorizontal: 5, color: '#dddddd' },
  headerRule: { borderBottomWidth: 0.5, marginBottom: 4, marginTop: 12 },
  headerRule2: { borderBottomWidth: 0.25, borderBottomColor: '#e5e7eb', marginBottom: 16 },
  sectionBlock: { marginTop: 16 },
  sectionTitle: { fontSize: 7.5, fontFamily: SANS, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 8 },
  sectionRule: { borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb', marginBottom: 8 },
  expItem: { marginBottom: 9 },
  expRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  expTitle: { fontFamily: SANS, fontWeight: 700, fontSize: 10 },
  expDates: { fontSize: 8.5, color: '#9ca3af' },
  expCompany: { fontSize: 9.5, color: '#4b5563', marginBottom: 3, fontFamily: SANS, fontStyle: 'italic' },
  bullet: { flexDirection: 'row', marginTop: 1.5, paddingLeft: 6 },
  bulletDash: { width: 10, color: '#d1d5db' },
  bulletText: { flex: 1, fontSize: 9.5, color: '#374151', lineHeight: 1.45 },
  eduItem: { marginBottom: 7 },
  eduRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  eduDegree: { fontFamily: SANS, fontWeight: 700, fontSize: 10 },
  eduDates: { fontSize: 8.5, color: '#9ca3af' },
  eduSchool: { fontSize: 9.5, color: '#4b5563', fontFamily: SANS, fontStyle: 'italic' },
  eduNotes: { fontSize: 8.5, color: '#9ca3af', marginTop: 1 },
  skills: { fontSize: 9.5, color: '#374151', lineHeight: 1.6 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerText: { flex: 1 },
  photo: { width: 60, height: 76, marginRight: 18, objectFit: 'cover' },
});

export function SleekTemplate({ data, labels, accentColor, companyLogo }: Props) {
  const { personal, experience, education, skills } = data;
  const contact = [personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean);

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <View style={s.sectionBlock}>
        <Text style={[s.sectionTitle, { color: accentColor }]}>{title.toUpperCase()}</Text>
        <View style={s.sectionRule} />
        {children}
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
        <View style={s.headerRow}>
          {personal.photo && <Image src={personal.photo} style={s.photo} />}
          <View style={[s.header, s.headerText]}>
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
          </View>
        </View>
        <View style={[s.headerRule, { borderBottomColor: accentColor }]} />
        <View style={s.headerRule2} />

        {data.summary && (
          <Section title={labels.summary}>
            <Text style={{ fontSize: 9.5, color: '#374151', lineHeight: 1.55 }}>{data.summary}</Text>
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
                <View key={proj.id} style={s.expItem}>
                  <View style={s.expRow}>
                    <Text style={s.expTitle}>{proj.name}</Text>
                    {proj.url && <Text style={{ fontSize: 8.5, color: accentColor }}>{proj.url}</Text>}
                  </View>
                  {proj.description && <Text style={s.expCompany}>{proj.description}</Text>}
                  {bullets.map((b, i) => (
                    <View key={i} style={s.bullet}>
                      <Text style={s.bulletDash}>–</Text>
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
                {cert.date && <Text style={{ fontSize: 8.5, color: '#9ca3af' }}>{cert.date}</Text>}
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
