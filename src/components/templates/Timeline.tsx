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
  page: { fontFamily: SANS, fontSize: 10, paddingTop: 40, paddingBottom: 44, paddingHorizontal: 52, color: '#1a1a1a' },
  name: { fontSize: 22, fontFamily: SANS, fontWeight: 700, marginBottom: 3, letterSpacing: 0.3 },
  title: { fontSize: 11, color: '#555555', marginBottom: 6 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', fontSize: 8.5, color: '#666666', marginBottom: 18 },
  contactSep: { marginHorizontal: 5, color: '#cccccc' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 6 },
  sectionDot: { width: 7, height: 7, borderRadius: 4, marginRight: 8 },
  sectionTitle: { fontSize: 8, fontFamily: SANS, fontWeight: 700, letterSpacing: 1.5 },
  sectionRule: { borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb', marginBottom: 8 },
  expWrapper: { flexDirection: 'row' },
  timelineCol: { width: 20, alignItems: 'center' },
  timelineCircle: { width: 8, height: 8, borderRadius: 4 },
  timelineLineWrap: { flex: 1, alignItems: 'center', paddingTop: 2 },
  timelineLine: { width: 2, flex: 1 },
  expContent: { flex: 1, paddingLeft: 8, paddingBottom: 10 },
  expRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  expTitle: { fontFamily: SANS, fontWeight: 700, fontSize: 10 },
  expCompany: { fontSize: 9, color: '#4b5563', marginBottom: 3 },
  expDates: { fontSize: 8.5, color: '#9ca3af' },
  bullet: { flexDirection: 'row', marginTop: 1.5, paddingLeft: 4 },
  bulletDot: { width: 10, color: '#9ca3af' },
  bulletText: { flex: 1, fontSize: 9.5, color: '#374151', lineHeight: 1.4 },
  normalItem: { marginBottom: 8 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  itemTitle: { fontFamily: SANS, fontWeight: 700, fontSize: 10 },
  itemSub: { fontSize: 9, color: '#4b5563', marginTop: 1 },
  itemDates: { fontSize: 8.5, color: '#9ca3af' },
  itemNotes: { fontSize: 9, color: '#94a3b8', marginTop: 1 },
  skills: { fontSize: 9.5, color: '#374151', lineHeight: 1.5 },
  photo: { width: 84, height: 104, borderRadius: 3, marginBottom: 12, objectFit: 'cover' },
});

export function TimelineTemplate({ data, labels, accentColor, companyLogo }: Props) {
  const { personal, experience, education, skills } = data;
  const contact: { text: string; url?: string }[] = [
    { text: personal.email }, { text: personal.phone }, { text: personal.location },
    { text: personal.linkedin }, { text: personal.website },
    ...(personal.links ?? []).map((l) => ({
      text: l.label || l.url,
      url: l.url.startsWith('http') ? l.url : `https://${l.url}`,
    })),
  ].filter((c) => Boolean(c.text));

  function SectionHead({ label }: { label: string }) {
    return (
      <View minPresenceAhead={60}>
        <View style={s.sectionHeader}>
          <View style={[s.sectionDot, { backgroundColor: accentColor }]} />
          <Text style={[s.sectionTitle, { color: accentColor }]}>{label.toUpperCase()}</Text>
        </View>
        <View style={s.sectionRule} />
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
        {personal.photo && <Image src={personal.photo} style={s.photo} />}
        {personal.name && <Text style={s.name}>{personal.name}</Text>}
        {personal.title && <Text style={s.title}>{personal.title}</Text>}
        {contact.length > 0 && (
          <View style={s.contactRow}>
            {contact.map((item, i) => (
              <View key={i} style={{ flexDirection: 'row' }}>
                {i > 0 && <Text style={s.contactSep}>·</Text>}
                {item.url
                  ? <Link src={item.url}><Text>{item.text}</Text></Link>
                  : <Text>{item.text}</Text>}
              </View>
            ))}
          </View>
        )}

        {data.summary && (
          <View>
            <SectionHead label={labels.summary} />
            <Text style={{ fontSize: 9.5, color: '#374151', lineHeight: 1.5, marginBottom: 6 }}>{data.summary}</Text>
          </View>
        )}

        {experience.length > 0 && (
          <View>
            <SectionHead label={labels.experience} />
            {experience.map((exp, idx) => {
              const bullets = (exp.bullets || []).filter((b) => b.trim());
              const dateRange = exp.current
                ? `${exp.startDate} – ${labels.present}`
                : [exp.startDate, exp.endDate].filter(Boolean).join(' – ');
              const isLast = idx === experience.length - 1;
              return (
                <View key={exp.id} style={s.expWrapper} wrap={false}>
                  <View style={s.timelineCol}>
                    <View style={[s.timelineCircle, { backgroundColor: accentColor }]} />
                    {!isLast && (
                      <View style={s.timelineLineWrap}>
                        <View style={[s.timelineLine, { backgroundColor: accentColor, opacity: 0.3 }]} />
                      </View>
                    )}
                  </View>
                  <View style={s.expContent}>
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
                </View>
              );
            })}
          </View>
        )}

        {data.projects && data.projects.length > 0 && (
          <View wrap={false}>
            <SectionHead label={labels.projects} />
            {data.projects.map((proj) => {
              const bullets = (proj.bullets || []).filter((b) => b.trim());
              return (
                <View key={proj.id} style={s.normalItem} wrap={false}>
                  <View style={s.itemRow}>
                    <Text style={s.itemTitle}>{proj.name}</Text>
                    {proj.url && <Text style={{ fontSize: 8.5, color: accentColor }}>{proj.url}</Text>}
                  </View>
                  {proj.description && <Text style={s.itemSub}>{proj.description}</Text>}
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
            <SectionHead label={labels.education} />
            {education.map((edu) => {
              const dateRange = [edu.startDate, edu.endDate].filter(Boolean).join(' – ');
              return (
                <View key={edu.id} style={s.normalItem} wrap={false}>
                  <View style={s.itemRow}>
                    <Text style={s.itemTitle}>{[edu.degree, edu.school].filter(Boolean).join(' · ')}</Text>
                    {dateRange && <Text style={s.itemDates}>{dateRange}</Text>}
                  </View>
                  {edu.notes && <Text style={s.itemNotes}>{edu.notes}</Text>}
                </View>
              );
            })}
          </View>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <View wrap={false}>
            <SectionHead label={labels.certifications} />
            {data.certifications.map((cert, idx) => (
              <View
                key={cert.id}
                style={{
                  marginBottom: idx === data.certifications!.length - 1 ? 0 : 3,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ fontSize: 9.5, fontFamily: SANS, fontWeight: 700 }}>{cert.name}{cert.issuer ? ` · ${cert.issuer}` : ''}</Text>
                {cert.date && <Text style={{ fontSize: 9, color: '#9ca3af' }}>{cert.date}</Text>}
              </View>
            ))}
          </View>
        )}

        {data.languages && data.languages.length > 0 && (
          <View wrap={false}>
            <SectionHead label={labels.languages} />
            {(data.languages ?? []).map((lang, idx) => (
              <View key={lang.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: idx === (data.languages ?? []).length - 1 ? 0 : 3 }}>
                <Text style={{ fontSize: 9.5, fontFamily: SANS, fontWeight: 700 }}>{lang.name}</Text>
                {lang.level ? <Text style={{ fontSize: 9, color: '#6b7280' }}>{lang.level}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {skills && (
          <View>
            <SectionHead label={labels.skills} />
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
