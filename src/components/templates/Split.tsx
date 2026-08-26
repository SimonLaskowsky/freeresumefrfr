import { Document, Page, Text, View, Image, StyleSheet, Link } from '@react-pdf/renderer';
import { SANS } from './fonts';
import type { ResumeData } from '@/store/resumeStore';

interface Props {
  data: ResumeData;
  labels: { summary: string; experience: string; education: string; skills: string; projects: string; certifications: string; languages: string; contact: string; present: string; };
  accentColor: string;
  companyLogo?: string;
}

const s = StyleSheet.create({
  page: { fontFamily: SANS, fontSize: 10, paddingTop: 40, paddingBottom: 40, paddingHorizontal: 44, color: '#1a1a1a' },
  header: { marginBottom: 16 },
  name: { fontSize: 22, fontFamily: SANS, fontWeight: 700, marginBottom: 3, letterSpacing: 0.3 },
  title: { fontSize: 11, color: '#555555', marginBottom: 6 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', fontSize: 8.5, color: '#6b7280' },
  contactSep: { marginHorizontal: 5, color: '#d1d5db' },
  headerRule: { borderBottomWidth: 1, borderBottomColor: '#e5e7eb', marginTop: 12 },
  columns: { flexDirection: 'row', marginTop: 0 },
  leftCol: { width: '43%', paddingRight: 14 },
  rightCol: { flex: 1, paddingLeft: 14, borderLeftWidth: 1, borderLeftColor: '#e5e7eb' },
  pillLabel: { fontSize: 7, fontFamily: SANS, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 3, marginTop: 14, marginBottom: 7, alignSelf: 'flex-start' },
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
  eduDegree: { fontFamily: SANS, fontWeight: 700, fontSize: 9.5 },
  eduDates: { fontSize: 8.5, color: '#6b7280' },
  eduSchool: { fontSize: 9, color: '#4b5563' },
  eduNotes: { fontSize: 8.5, color: '#6b7280', marginTop: 1 },
  skills: { fontSize: 9, color: '#374151', lineHeight: 1.6 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start' },
  headerText: { flex: 1 },
  photo: { width: 60, height: 76, borderRadius: 3, marginRight: 16, marginTop: 2, objectFit: 'cover' },
});

export function SplitTemplate({ data, labels, accentColor, companyLogo }: Props) {
  const { personal, experience, education, skills } = data;
  const contact: { text: string; url?: string }[] = [
    { text: personal.email }, { text: personal.phone }, { text: personal.location },
    { text: personal.linkedin }, { text: personal.website },
    ...(personal.links ?? []).map((l) => ({
      text: l.label || l.url,
      url: l.url.startsWith('http') ? l.url : `https://${l.url}`,
    })),
  ].filter((c) => Boolean(c.text));

  function Pill({ label }: { label: string }) {
    return (
      <View style={[s.pillLabel, { backgroundColor: accentColor }]} minPresenceAhead={120}>
        <Text style={{ color: '#ffffff' }}>{label.toUpperCase()}</Text>
      </View>
    );
  }

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {companyLogo && (
          <View fixed style={{ position: 'absolute', bottom: 24, right: 24 }}>
            <Image src={companyLogo} style={{ width: 160, height: 160, opacity: 0.10, objectFit: 'contain' }} />
          </View>
        )}
        <View style={s.header}>
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
          <View style={s.headerRule} />
        </View>

        <View style={s.columns}>
          {/* Left column */}
          <View style={s.leftCol}>
            {data.summary && (
              <View>
                <Pill label={labels.summary} />
                <Text style={{ fontSize: 9, color: '#374151', lineHeight: 1.5 }}>{data.summary}</Text>
              </View>
            )}
            {skills && (
              <View wrap={false}>
                <Pill label={labels.skills} />
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
            {education.length > 0 && (
              <View wrap={false}>
                <Pill label={labels.education} />
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
            {data.certifications && data.certifications.length > 0 && (
              <View wrap={false}>
                <Pill label={labels.certifications} />
                {data.certifications.map((cert, idx) => (
                  <View
                    key={cert.id}
                    style={{ marginBottom: idx === data.certifications!.length - 1 ? 0 : 4 }}
                  >
                    <Text style={{ fontSize: 9, fontFamily: SANS, fontWeight: 700 }}>{cert.name}</Text>
                    <Text style={{ fontSize: 8.5, color: '#6b7280' }}>{[cert.issuer, cert.date].filter(Boolean).join(' · ')}</Text>
                  </View>
                ))}
              </View>
            )}

            {data.languages && data.languages.length > 0 && (
              <View wrap={false}>
                <Pill label={labels.languages} />
                {(data.languages ?? []).map((lang, idx) => (
                  <View key={lang.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: idx === (data.languages ?? []).length - 1 ? 0 : 3 }}>
                    <Text style={{ fontSize: 9, fontFamily: SANS, fontWeight: 700 }}>{lang.name}</Text>
                    {lang.level ? <Text style={{ fontSize: 8.5, color: '#6b7280' }}>{lang.level}</Text> : null}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right column */}
          <View style={s.rightCol}>
            {experience.length > 0 && (
              <View>
                <Pill label={labels.experience} />
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
            {data.projects && data.projects.length > 0 && (
              <View wrap={false}>
                <Pill label={labels.projects} />
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
          </View>
        </View>
      </Page>
    </Document>
  );
}
