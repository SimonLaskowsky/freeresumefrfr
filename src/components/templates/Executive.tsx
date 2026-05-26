import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
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
  present: string;
}

const s = StyleSheet.create({
  page: {
    fontFamily: SANS, fontSize: 10,
    paddingTop: 48, paddingBottom: 48, paddingHorizontal: 72, color: '#1a1a1a',
  },

  header: { alignItems: 'center', marginBottom: 16 },
  name: { fontSize: 20, fontFamily: SANS, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 5 },
  title: { fontSize: 10.5, color: '#555555', letterSpacing: 0.5, marginBottom: 10 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', fontSize: 8.5, color: '#666666' },
  contactSep: { marginHorizontal: 6, color: '#cccccc' },

  headerRule: { borderBottomWidth: 1, borderBottomColor: '#1a1a1a', marginBottom: 0 },
  headerRuleThin: { borderBottomWidth: 0.25, borderBottomColor: '#888888', marginTop: 2, marginBottom: 14 },

  sectionRow: { flexDirection: 'row', marginTop: 12 },
  sectionLabelCol: { width: 110 },
  sectionLabel: {
    fontSize: 8, fontFamily: SANS, fontWeight: 700, letterSpacing: 1.2,
    textTransform: 'uppercase', paddingTop: 1,
  },
  sectionContent: { flex: 1 },

  expItem: { marginBottom: 8 },
  expRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  expTitle: { fontFamily: SANS, fontWeight: 700, fontSize: 10 },
  expDates: { fontSize: 8.5, color: '#666666' },
  expCompany: { fontSize: 9.5, color: '#4b5563', marginBottom: 2 },
  bullet: { flexDirection: 'row', marginTop: 1.5, paddingLeft: 4 },
  bulletDot: { width: 10, color: '#555555' },
  bulletText: { flex: 1, fontSize: 9.5, color: '#333333', lineHeight: 1.45 },

  eduItem: { marginBottom: 6 },
  eduRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  eduDegree: { fontFamily: SANS, fontWeight: 700, fontSize: 10 },
  eduDates: { fontSize: 8.5, color: '#666666' },
  eduSchool: { fontSize: 9.5, color: '#4b5563' },
  eduNotes: { fontSize: 8.5, color: '#6b7280', marginTop: 1 },

  skills: { fontSize: 9.5, color: '#333333', lineHeight: 1.5 },
  photo: { width: 64, height: 80, borderRadius: 1, marginBottom: 12, objectFit: 'cover' },
});

function LabeledSection({ label, children, accentColor }: { label: string; children: React.ReactNode; accentColor: string }) {
  return (
    <View style={s.sectionRow}>
      <View style={s.sectionLabelCol}>
        <Text style={[s.sectionLabel, { color: accentColor }]}>{label}</Text>
      </View>
      <View style={s.sectionContent}>{children}</View>
    </View>
  );
}

export function ExecutiveTemplate({ data, labels, accentColor, companyLogo }: { data: ResumeData; labels: Labels; accentColor: string; companyLogo?: string }) {
  const { personal, experience, education, skills } = data;
  const contact = [personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean);

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
                  {i > 0 && <Text style={s.contactSep}>·</Text>}
                  <Text>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={s.headerRule} />
        <View style={s.headerRuleThin} />

        {data.summary && (
          <LabeledSection label={labels.summary} accentColor={accentColor}>
            <Text style={s.skills}>{data.summary}</Text>
          </LabeledSection>
        )}

        {experience.length > 0 && (
          <LabeledSection label={labels.experience} accentColor={accentColor}>
            {experience.map((exp) => {
              const bullets = (exp.bullets || []).filter((b) => b.trim());
              const dateRange = exp.current
                ? `${exp.startDate} – ${labels.present}`
                : [exp.startDate, exp.endDate].filter(Boolean).join(' – ');
              return (
                <View key={exp.id} style={s.expItem}>
                  <View style={s.expRow}>
                    <Text style={s.expTitle}>{[exp.title, exp.company].filter(Boolean).join(', ')}</Text>
                    {dateRange && <Text style={s.expDates}>{dateRange}</Text>}
                  </View>
                  {bullets.map((b, i) => (
                    <View key={i} style={s.bullet}>
                      <Text style={s.bulletDot}>•</Text>
                      <Text style={s.bulletText}>{b.trim()}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </LabeledSection>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <LabeledSection label={labels.projects} accentColor={accentColor}>
            {data.projects.map((proj) => {
              const bullets = (proj.bullets || []).filter((b) => b.trim());
              return (
                <View key={proj.id} style={s.expItem}>
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
                </View>
              );
            })}
          </LabeledSection>
        )}

        {education.length > 0 && (
          <LabeledSection label={labels.education} accentColor={accentColor}>
            {education.map((edu) => {
              const dateRange = [edu.startDate, edu.endDate].filter(Boolean).join(' – ');
              return (
                <View key={edu.id} style={s.eduItem}>
                  <View style={s.eduRow}>
                    <Text style={s.eduDegree}>{[edu.degree, edu.school].filter(Boolean).join(', ')}</Text>
                    {dateRange && <Text style={s.eduDates}>{dateRange}</Text>}
                  </View>
                  {edu.notes && <Text style={s.eduNotes}>{edu.notes}</Text>}
                </View>
              );
            })}
          </LabeledSection>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <LabeledSection label={labels.certifications} accentColor={accentColor}>
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
                {cert.date ? <Text style={{ fontSize: 8.5, color: '#666666' }}>{cert.date}</Text> : null}
              </View>
            ))}
          </LabeledSection>
        )}

        {skills && (
          <LabeledSection label={labels.skills} accentColor={accentColor}>
            <Text style={s.skills}>{skills}</Text>
          </LabeledSection>
        )}
      </Page>
    </Document>
  );
}
