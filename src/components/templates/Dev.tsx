import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { SANS } from './fonts';
import type { ResumeData } from '@/store/resumeStore';

interface Props {
  data: ResumeData;
  labels: { summary: string; experience: string; education: string; skills: string; projects: string; certifications: string; contact: string; };
  accentColor: string;
}

const s = StyleSheet.create({
  page: { fontFamily: SANS, fontSize: 10, paddingTop: 40, paddingBottom: 40, paddingHorizontal: 50, color: '#1a1a1a' },
  name: { fontSize: 22, fontFamily: SANS, fontWeight: 700, marginBottom: 2 },
  title: { fontSize: 10.5, color: '#4b5563', marginBottom: 4 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', fontSize: 8.5, color: '#6b7280', marginBottom: 16 },
  contactSep: { marginHorizontal: 5, color: '#d1d5db' },
  sectionComment: { fontSize: 10, fontFamily: SANS, fontWeight: 700, marginTop: 14, marginBottom: 6 },
  sectionRule: { borderBottomWidth: 1, borderBottomColor: '#e5e7eb', marginBottom: 8 },
  expItem: { marginBottom: 9 },
  expRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  expTitle: { fontFamily: SANS, fontWeight: 700, fontSize: 10 },
  expDates: { fontSize: 8.5, color: '#6b7280' },
  expCompany: { fontSize: 9.5, color: '#4b5563', marginBottom: 2 },
  bullet: { flexDirection: 'row', marginTop: 1.5, paddingLeft: 4 },
  bulletArrow: { width: 14, fontSize: 9.5 },
  bulletText: { flex: 1, fontSize: 9.5, color: '#374151', lineHeight: 1.4 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  skillPill: { fontSize: 8, paddingVertical: 2, paddingHorizontal: 6, borderWidth: 1, borderRadius: 3, marginRight: 4, marginBottom: 4 },
  eduItem: { marginBottom: 7 },
  eduRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  eduDegree: { fontFamily: SANS, fontWeight: 700, fontSize: 10 },
  eduDates: { fontSize: 8.5, color: '#6b7280' },
  eduSchool: { fontSize: 9.5, color: '#4b5563' },
  eduNotes: { fontSize: 8.5, color: '#6b7280', marginTop: 1 },
});

export function DevTemplate({ data, labels, accentColor }: Props) {
  const { personal, experience, education, skills } = data;
  const contact = [personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean);
  const skillList = skills.split(',').map((s) => s.trim()).filter(Boolean);

  function CommentSection({ label, children }: { label: string; children: React.ReactNode }) {
    return (
      <View>
        <Text style={[s.sectionComment, { color: accentColor }]}>{`// ${label}`}</Text>
        <View style={s.sectionRule} />
        {children}
      </View>
    );
  }

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

        {data.summary && (
          <CommentSection label={labels.summary}>
            <Text style={{ fontSize: 9.5, color: '#374151', lineHeight: 1.5, marginBottom: 6 }}>{data.summary}</Text>
          </CommentSection>
        )}

        {experience.length > 0 && (
          <CommentSection label={labels.experience}>
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
                      <Text style={[s.bulletArrow, { color: accentColor }]}>{'→'}</Text>
                      <Text style={s.bulletText}>{b.trim()}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </CommentSection>
        )}

        {data.projects && data.projects.length > 0 && (
          <CommentSection label={labels.projects}>
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
                      <Text style={[s.bulletArrow, { color: accentColor }]}>{'→'}</Text>
                      <Text style={s.bulletText}>{b.trim()}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </CommentSection>
        )}

        {education.length > 0 && (
          <CommentSection label={labels.education}>
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
          </CommentSection>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <CommentSection label={labels.certifications}>
            {data.certifications.map((cert) => (
              <View key={cert.id} style={{ marginBottom: 4, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 9.5, fontFamily: SANS, fontWeight: 700 }}>{cert.name}{cert.issuer ? ` · ${cert.issuer}` : ''}</Text>
                {cert.date && <Text style={{ fontSize: 8.5, color: '#6b7280' }}>{cert.date}</Text>}
              </View>
            ))}
          </CommentSection>
        )}

        {skillList.length > 0 && (
          <CommentSection label={labels.skills}>
            <View style={s.skillsRow}>
              {skillList.map((skill, i) => (
                <View key={i} style={[s.skillPill, { borderColor: accentColor }]}>
                  <Text style={{ color: accentColor }}>{skill}</Text>
                </View>
              ))}
            </View>
          </CommentSection>
        )}
      </Page>
    </Document>
  );
}
