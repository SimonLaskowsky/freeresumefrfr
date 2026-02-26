import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { SANS } from '../templates/fonts';
import type { CoverLetterTemplateProps } from './index';

const HEADER_BG = '#18181b';

const styles = StyleSheet.create({
  page: {
    fontFamily: SANS,
    fontSize: 10.5,
    paddingBottom: 54,
    color: '#1a1a1a',
    lineHeight: 1.5,
  },
  header: {
    backgroundColor: HEADER_BG,
    paddingTop: 32,
    paddingBottom: 26,
    paddingHorizontal: 52,
    marginBottom: 28,
  },
  senderName: {
    fontSize: 20,
    fontFamily: SANS,
    fontWeight: 700,
    marginBottom: 4,
  },
  contactLine: {
    fontSize: 9.5,
    color: '#a1a1aa',
  },
  body: {
    paddingHorizontal: 52,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 10,
    color: '#555555',
  },
  recipientBlock: {
    marginBottom: 16,
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
    marginBottom: 14,
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
    marginTop: 16,
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

export function BoldCoverLetter({ data, labels, accentColor }: CoverLetterTemplateProps) {
  const contactParts = [data.senderEmail, data.senderPhone, data.senderLocation].filter(Boolean);
  const contactLine = contactParts.join('  ·  ');
  const recipientLine1 = data.recipientName || labels.hiringManager;
  const recipientDetails = [data.recipientTitle, data.companyName].filter(Boolean);

  return (
    <Document>
      <Page size={data.pageSize || 'LETTER'} style={styles.page}>
        <View style={styles.header}>
          {data.senderName && <Text style={[styles.senderName, { color: accentColor }]}>{data.senderName}</Text>}
          {contactLine ? <Text style={styles.contactLine}>{contactLine}</Text> : null}
        </View>

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
            {data.senderName && <Text style={[styles.senderSignature, { color: accentColor }]}>{data.senderName}</Text>}
          </View>
        </View>
      </Page>
    </Document>
  );
}
