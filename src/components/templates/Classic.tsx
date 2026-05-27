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

const styles = StyleSheet.create({
  page: {
    fontFamily: SANS,
    fontSize: 10,
    paddingTop: 42,
    paddingBottom: 42,
    paddingHorizontal: 52,
    color: '#1a1a1a',
  },
  name: {
    fontSize: 22,
    fontFamily: SANS,
    fontWeight: 700,
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  jobTitle: {
    fontSize: 11,
    color: '#444444',
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 9,
    color: '#555555',
    marginBottom: 4,
  },
  contactSep: {
    marginHorizontal: 5,
    color: '#aaaaaa',
  },
  divider: {
    borderBottomWidth: 1,
    marginTop: 10,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 8.5,
    fontFamily: SANS,
    fontWeight: 700,
    letterSpacing: 1.5,
    marginBottom: 7,
    marginTop: 4,
  },
  expItem: {
    marginBottom: 9,
  },
  expTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  expTitleCompany: {
    fontFamily: SANS,
    fontWeight: 700,
    fontSize: 10,
  },
  expDates: {
    fontSize: 9,
    color: '#666666',
  },
  bullet: {
    flexDirection: 'row',
    marginTop: 1.5,
    paddingLeft: 6,
  },
  bulletDot: {
    width: 10,
    color: '#444',
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: '#333333',
    lineHeight: 1.4,
  },
  eduItem: {
    marginBottom: 7,
  },
  eduTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  eduDegreeSchool: {
    fontFamily: SANS,
    fontWeight: 700,
    fontSize: 10,
  },
  eduDates: {
    fontSize: 9,
    color: '#666666',
  },
  eduNotes: {
    fontSize: 9.5,
    color: '#444444',
    marginTop: 1,
  },
  skillsText: {
    fontSize: 9.5,
    color: '#333333',
    lineHeight: 1.5,
  },
  photo: { width: 90, height: 112, marginBottom: 10, objectFit: 'cover' },
});

export function ClassicTemplate({ data, labels, accentColor, companyLogo }: { data: ResumeData; labels: Labels; accentColor: string; companyLogo?: string }) {
  const { personal, experience, education, skills } = data;

  const contactItems = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website,
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {companyLogo && (
          <View style={{ position: 'absolute', bottom: 24, right: 24 }}>
            <Image src={companyLogo} style={{ width: 160, height: 160, opacity: 0.10, objectFit: 'contain' }} />
          </View>
        )}
        {/* Header */}
        {personal.photo && <Image src={personal.photo} style={styles.photo} />}
        {personal.name && <Text style={[styles.name, { color: accentColor }]}>{personal.name}</Text>}
        {personal.title && <Text style={styles.jobTitle}>{personal.title}</Text>}
        {contactItems.length > 0 && (
          <View style={styles.contactRow}>
            {contactItems.map((item, i) => (
              <View key={i} style={{ flexDirection: 'row' }}>
                {i > 0 && <Text style={styles.contactSep}>·</Text>}
                <Text>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Summary */}
        {data.summary && (
          <View>
            <View minPresenceAhead={60}>
              <View style={[styles.divider, { borderBottomColor: accentColor }]} />
            <Text style={[styles.sectionTitle, { color: accentColor }]}>{labels.summary.toUpperCase()}</Text>
            </View>
            <Text style={{ fontSize: 9.5, color: '#333333', lineHeight: 1.5 }}>{data.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <View>
            <View minPresenceAhead={60}>
              <View style={[styles.divider, { borderBottomColor: accentColor }]} />
            <Text style={[styles.sectionTitle, { color: accentColor }]}>{labels.experience.toUpperCase()}</Text>
            </View>
            {experience.map((exp) => {
              const bullets = (exp.bullets || []).filter((b) => b.trim());
              const dateRange = exp.current
                ? `${exp.startDate} – ${labels.present}`
                : [exp.startDate, exp.endDate].filter(Boolean).join(' – ');
              return (
                <View key={exp.id} style={styles.expItem} wrap={false}>
                  <View style={styles.expTopRow}>
                    <Text style={styles.expTitleCompany}>
                      {[exp.title, exp.company].filter(Boolean).join(' · ')}
                    </Text>
                    {dateRange && <Text style={styles.expDates}>{dateRange}</Text>}
                  </View>
                  {bullets.map((bullet, i) => (
                    <View key={i} style={styles.bullet}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{bullet.trim()}</Text>
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
              <View style={[styles.divider, { borderBottomColor: accentColor }]} />
            <Text style={[styles.sectionTitle, { color: accentColor }]}>{labels.projects.toUpperCase()}</Text>
            </View>
            {data.projects.map((proj) => {
              const bullets = (proj.bullets || []).filter((b) => b.trim());
              return (
                <View key={proj.id} style={styles.expItem} wrap={false}>
                  <View style={styles.expTopRow}>
                    <Text style={styles.expTitleCompany}>{proj.name}</Text>
                    {proj.url ? <Text style={{ fontSize: 8.5, color: accentColor }}>{proj.url}</Text> : null}
                  </View>
                  {proj.description ? <Text style={{ fontSize: 9.5, color: '#444444', marginBottom: 2 }}>{proj.description}</Text> : null}
                  {bullets.map((b, i) => (
                    <View key={i} style={styles.bullet}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{b.trim()}</Text>
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

        {/* Education */}
        {education.length > 0 && (
          <View wrap={false}>
            <View minPresenceAhead={60}>
              <View style={[styles.divider, { borderBottomColor: accentColor }]} />
            <Text style={[styles.sectionTitle, { color: accentColor }]}>{labels.education.toUpperCase()}</Text>
            </View>
            {education.map((edu) => {
              const dateRange = [edu.startDate, edu.endDate].filter(Boolean).join(' – ');
              return (
                <View key={edu.id} style={styles.eduItem} wrap={false}>
                  <View style={styles.eduTopRow}>
                    <Text style={styles.eduDegreeSchool}>
                      {[edu.degree, edu.school].filter(Boolean).join(' · ')}
                    </Text>
                    {dateRange && <Text style={styles.eduDates}>{dateRange}</Text>}
                  </View>
                  {edu.notes && <Text style={styles.eduNotes}>{edu.notes}</Text>}
                </View>
              );
            })}
          </View>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <View wrap={false}>
            <View minPresenceAhead={60}>
              <View style={[styles.divider, { borderBottomColor: accentColor }]} />
            <Text style={[styles.sectionTitle, { color: accentColor }]}>{labels.certifications.toUpperCase()}</Text>
            </View>
            {data.certifications.map((cert, idx) => (
              <View
                key={cert.id}
                style={{
                  marginBottom: idx === data.certifications!.length - 1 ? 0 : 4,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ fontSize: 9.5, fontFamily: SANS, fontWeight: 700 }}>{cert.name}{cert.issuer ? ` · ${cert.issuer}` : ''}</Text>
                {cert.date ? <Text style={{ fontSize: 9, color: '#666666' }}>{cert.date}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && (
          <View>
            <View minPresenceAhead={60}>
              <View style={[styles.divider, { borderBottomColor: accentColor }]} />
            <Text style={[styles.sectionTitle, { color: accentColor }]}>{labels.skills.toUpperCase()}</Text>
            </View>
            <Text style={styles.skillsText}>{skills}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
