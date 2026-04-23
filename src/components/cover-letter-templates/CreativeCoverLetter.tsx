import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { SANS } from '../templates/fonts';
import type { CoverLetterTemplateProps } from './index';

const styles = StyleSheet.create({
  page: {
    fontFamily: SANS,
    fontSize: 10.5,
    paddingBottom: 54,
    color: '#1a1a1a',
    lineHeight: 1.5,
    flexDirection: 'row',
  },
  accentStrip: {
    width: 12,
    flexShrink: 0,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },
  headerBar: {
    paddingTop: 30,
    paddingBottom: 22,
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  senderName: {
    fontSize: 18,
    fontFamily: SANS,
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: 3,
  },
  contactLine: {
    fontSize: 9.5,
    color: '#ffffff',
    opacity: 0.8,
  },
  body: {
    paddingHorizontal: 40,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 14,
  },
  dateText: {
    fontSize: 10,
    color: '#555555',
  },
  recipientBlock: {
    marginBottom: 14,
  },
  recipientName: {
    fontSize: 10.5,
    fontFamily: SANS,
    fontWeight: 700,
  },
  recipientDetail: {
    fontSize: 10,
    color: '#444444',
  },
  jobTitleRef: {
    fontSize: 10,
    marginBottom: 12,
    fontFamily: SANS,
    fontWeight: 700,
  },
  salutation: {
    fontSize: 10.5,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 10.5,
    color: '#1a1a1a',
    lineHeight: 1.6,
    marginBottom: 12,
  },
  signOffBlock: {
    marginTop: 14,
  },
  signOffText: {
    fontSize: 10.5,
    marginBottom: 28,
  },
  senderSignature: {
    fontSize: 10.5,
    fontFamily: SANS,
    fontWeight: 700,
  },
});

export function CreativeCoverLetter({ data, labels, accentColor }: CoverLetterTemplateProps) {
  const contactParts = [data.senderEmail, data.senderPhone, data.senderLocation].filter(Boolean);
  const contactLine = contactParts.join('  ·  ');
  const recipientLine1 = data.recipientName || labels.hiringManager;
  const recipientDetails = [data.recipientTitle, data.companyName].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Left accent strip */}
        <View style={[styles.accentStrip, { backgroundColor: accentColor }]} />

        {/* Main content */}
        <View style={styles.mainContent}>
          {/* Colored header bar */}
          <View style={[styles.headerBar, { backgroundColor: accentColor }]}>
            {data.senderName && <Text style={styles.senderName}>{data.senderName}</Text>}
            {contactLine ? <Text style={styles.contactLine}>{contactLine}</Text> : null}
          </View>

          {/* Body */}
          <View style={styles.body}>
            {data.date && (
              <View style={styles.dateRow}>
                <Text style={styles.dateText}>{data.date}</Text>
              </View>
            )}

            <View style={styles.recipientBlock}>
              <Text style={styles.recipientName}>{recipientLine1}</Text>
              {recipientDetails.map((d, i) => (
                <Text key={i} style={styles.recipientDetail}>{d}</Text>
              ))}
            </View>

            {data.jobTitle && (
              <Text style={[styles.jobTitleRef, { color: accentColor }]}>
                {labels.reSubject}: {data.jobTitle}
              </Text>
            )}

            {data.salutation && <Text style={styles.salutation}>{data.salutation}</Text>}
            {data.opening && <Text style={styles.paragraph}>{data.opening}</Text>}
            {data.body && <Text style={styles.paragraph}>{data.body}</Text>}
            {data.closing && <Text style={styles.paragraph}>{data.closing}</Text>}

            <View style={styles.signOffBlock}>
              <Text style={styles.signOffText}>{data.signOff || 'Sincerely,'}</Text>
              {data.senderName && <Text style={styles.senderSignature}>{data.senderName}</Text>}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
