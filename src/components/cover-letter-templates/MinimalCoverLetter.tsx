import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { SANS } from '../templates/fonts';
import type { CoverLetterTemplateProps } from './index';

const styles = StyleSheet.create({
  page: {
    fontFamily: SANS,
    fontSize: 11,
    paddingTop: 70,
    paddingBottom: 70,
    paddingHorizontal: 70,
    color: '#1a1a1a',
    lineHeight: 1.7,
  },
  senderName: {
    fontSize: 16,
    fontFamily: SANS,
    fontWeight: 700,
    marginBottom: 3,
  },
  contactLine: {
    fontSize: 9.5,
    color: '#555555',
    marginBottom: 16,
  },
  rule: {
    borderBottomWidth: 0.5,
    marginBottom: 20,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 10,
    color: '#555555',
  },
  recipientBlock: {
    marginBottom: 18,
  },
  recipientName: {
    fontSize: 11,
    fontFamily: SANS,
    fontWeight: 700,
  },
  recipientDetail: {
    fontSize: 10,
    color: '#444444',
  },
  salutation: {
    fontSize: 11,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 11,
    color: '#1a1a1a',
    lineHeight: 1.7,
    marginBottom: 12,
  },
  signOffBlock: {
    marginTop: 20,
  },
  signOffText: {
    fontSize: 11,
    marginBottom: 28,
  },
  senderSignature: {
    fontSize: 11,
    fontFamily: SANS,
    fontWeight: 700,
  },
  jobRef: {
    fontSize: 10,
    color: '#555555',
    marginBottom: 14,
  },
});

export function MinimalCoverLetter({ data, labels, accentColor }: CoverLetterTemplateProps) {
  const contactParts = [data.senderEmail, data.senderPhone, data.senderLocation].filter(Boolean);
  const contactLine = contactParts.join('  ·  ');
  const recipientLine1 = data.recipientName || labels.hiringManager;
  const recipientDetails = [data.recipientTitle, data.companyName].filter(Boolean);

  return (
    <Document>
      <Page size={data.pageSize || 'LETTER'} style={styles.page}>
        {data.senderName && <Text style={styles.senderName}>{data.senderName}</Text>}
        {contactLine ? <Text style={styles.contactLine}>{contactLine}</Text> : <View style={{ marginBottom: 16 }} />}
        <View style={[styles.rule, { borderBottomColor: accentColor }]} />

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
          <Text style={[styles.jobRef, { color: accentColor }]}>
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
      </Page>
    </Document>
  );
}
