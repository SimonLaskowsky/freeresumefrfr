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
    fontFamily: SANS, fontSize: 9,
    paddingTop: 32, paddingBottom: 32, paddingHorizontal: 44, color: '#1a1a1a',
  },
  name: { fontSize: 20, fontFamily: SANS, fontWeight: 700, marginBottom: 2, letterSpacing: 0.2 },
  titleAndContact: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 2 },
  title: { fontSize: 10, color: '#4b5563' },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', fontSize: 8, color: '#6b7280', justifyContent: 'flex-end' },
  contactSep: { marginHorizontal: 4, color: '#d1d5db' },

  divider: { borderBottomWidth: 1, marginTop: 8, marginBottom: 4 },
  sectionTitle: {
    fontSize: 8, fontFamily: SANS, fontWeight: 700, letterSpacing: 1.2,
    textTransform: 'uppercase', marginBottom: 4, marginTop: 3,
  },

  expItem: { marginBottom: 6 },
  expRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 0.5 },
  expTitleCompany: { fontFamily: SANS, fontWeight: 700, fontSize: 9.5 },
  expDates: { fontSize: 8, color: '#6b7280' },
  bullet: { flexDirection: 'row', marginTop: 1, paddingLeft: 4 },
  bulletDot: { width: 8, color: '#555', fontSize: 9 },
  bulletText: { flex: 1, fontSize: 8.5, color: '#374151', lineHeight: 1.35 },

  eduItem: { marginBottom: 5 },
  eduRow: { flexDirection: 'row', justifyContent: 'space-between' },
  eduDegreeSchool: { fontFamily: SANS, fontWeight: 700, fontSize: 9.5 },
  eduDates: { fontSize: 8, color: '#6b7280' },
  eduNotes: { fontSize: 8.5, color: '#6b7280', marginTop: 0.5 },

  skills: { fontSize: 8.5, color: '#374151', lineHeight: 1.4 },
});

export function CompactTemplate({ data, labels, accentColor }: { data: ResumeData; labels: Labels; accentColor: string }) {
  const { personal, experience, education, skills } = data;
  const contact = [personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean);

  return (
    <Document>
      <Page size={data.pageSize || 'LETTER'} style={s.page}>
        {personal.name && <Text style={s.name}>{personal.name}</Text>}

        <View style={s.titleAndContact}>
          <Text style={s.title}>{personal.title}</Text>
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

        {/* Summary */}
        {data.summary && (
          <View>
            <View style={[s.divider, { borderBottomColor: accentColor }]} />
            <Text style={[s.sectionTitle, { color: accentColor }]}>{labels.summary}</Text>
            <Text style={{ fontSize: 8.5, color: '#374151', lineHeight: 1.4 }}>{data.summary}</Text>
          </View>
        )}

        {experience.length > 0 && (
          <View>
            <View style={[s.divider, { borderBottomColor: accentColor }]} />
            <Text style={[s.sectionTitle, { color: accentColor }]}>{labels.experience}</Text>
            {experience.map((exp) => {
              const bullets = (exp.bullets || []).filter((b) => b.trim());
              const dateRange = exp.current
                ? `${exp.startDate} – Present`
                : [exp.startDate, exp.endDate].filter(Boolean).join(' – ');
              return (
                <View key={exp.id} style={s.expItem}>
                  <View style={s.expRow}>
                    <Text style={s.expTitleCompany}>
                      {[exp.title, exp.company].filter(Boolean).join(' · ')}
                    </Text>
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
          </View>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <View>
            <View style={[s.divider, { borderBottomColor: accentColor }]} />
            <Text style={[s.sectionTitle, { color: accentColor }]}>{labels.projects}</Text>
            {data.projects.map((proj) => {
              const bullets = (proj.bullets || []).filter((b) => b.trim());
              return (
                <View key={proj.id} style={s.expItem}>
                  <View style={s.expRow}>
                    <Text style={s.expTitleCompany}>{proj.name}</Text>
                    {proj.url ? <Text style={{ fontSize: 7.5, color: accentColor }}>{proj.url}</Text> : null}
                  </View>
                  {proj.description ? <Text style={{ fontSize: 8, color: '#4b5563', marginBottom: 1 }}>{proj.description}</Text> : null}
                  {bullets.map((b, i) => (
                    <View key={i} style={s.bullet}>
                      <Text style={s.bulletDot}>•</Text>
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
            <View style={[s.divider, { borderBottomColor: accentColor }]} />
            <Text style={[s.sectionTitle, { color: accentColor }]}>{labels.education}</Text>
            {education.map((edu) => {
              const dateRange = [edu.startDate, edu.endDate].filter(Boolean).join(' – ');
              return (
                <View key={edu.id} style={s.eduItem}>
                  <View style={s.eduRow}>
                    <Text style={s.eduDegreeSchool}>{[edu.degree, edu.school].filter(Boolean).join(' · ')}</Text>
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
            <View style={[s.divider, { borderBottomColor: accentColor }]} />
            <Text style={[s.sectionTitle, { color: accentColor }]}>{labels.certifications}</Text>
            {data.certifications.map((cert) => (
              <View key={cert.id} style={{ marginBottom: 3, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 8.5, fontFamily: SANS, fontWeight: 700 }}>{cert.name}{cert.issuer ? ` · ${cert.issuer}` : ''}</Text>
                {cert.date ? <Text style={{ fontSize: 8, color: '#6b7280' }}>{cert.date}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {skills && (
          <View>
            <View style={[s.divider, { borderBottomColor: accentColor }]} />
            <Text style={[s.sectionTitle, { color: accentColor }]}>{labels.skills}</Text>
            <Text style={s.skills}>{skills}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
