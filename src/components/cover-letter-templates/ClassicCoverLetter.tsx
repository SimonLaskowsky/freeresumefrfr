import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { SANS } from '../templates/fonts';
import type { CoverLetterTemplateProps } from './index';

const styles = StyleSheet.create({
  page: {
    fontFamily: SANS,
    fontSize: 10.5,
    paddingTop: 54,
    paddingBottom: 54,
    paddingHorizontal: 62,
    color: '#1a1a1a',
    lineHeight: 1.5,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 22,
  },
  dateText: {
    fontSize: 10,
    color: '#555555',
  },
  senderName: {
    fontSize: 14,
    fontFamily: SANS,
    fontWeight: 700,
    marginBottom: 2,
  },
  contactLine: {
    fontSize: 9.5,
    color: '#555555',
    marginBottom: 20,
  },
  recipientBlock: {
    marginBottom: 18,
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

export function ClassicCoverLetter({ data, labels }: CoverLetterTemplateProps) {
  const contactParts = [data.senderEmail, data.senderPhone, data.senderLocation].filter(Boolean);
  const contactLine = contactParts.join('  ·  ');

  const recipientLine1 = data.recipientName || labels.hiringManager;
  const recipientDetails = [data.recipientTitle, data.companyName].filter(Boolean);

  return (
    <Document>
      <Page size={data.pageSize || 'LETTER'} style={styles.page}>
        {/* Date top-right */}
        {data.date && (
          <View style={styles.dateRow}>
            <Text style={styles.dateText}>{data.date}</Text>
          </View>
        )}

        {/* Sender */}
        {data.senderName && <Text style={styles.senderName}>{data.senderName}</Text>}
        {contactLine ? <Text style={styles.contactLine}>{contactLine}</Text> : <View style={{ marginBottom: 20 }} />}

        {/* Recipient block */}
        <View style={styles.recipientBlock}>
          <Text style={styles.recipientName}>{recipientLine1}</Text>
          {recipientDetails.map((d, i) => (
            <Text key={i} style={styles.recipientDetail}>{d}</Text>
          ))}
        </View>

        {/* Job title reference */}
        {data.jobTitle && (
          <Text style={{ fontSize: 10, color: '#555555', marginBottom: 14 }}>
            {labels.reSubject}: {data.jobTitle}
          </Text>
        )}

        {/* Salutation */}
        {data.salutation && <Text style={styles.salutation}>{data.salutation}</Text>}

        {/* Body paragraphs */}
        {data.opening && <Text style={styles.paragraph}>{data.opening}</Text>}
        {data.body && <Text style={styles.paragraph}>{data.body}</Text>}
        {data.closing && <Text style={styles.paragraph}>{data.closing}</Text>}

        {/* Sign-off */}
        <View style={styles.signOffBlock}>
          <Text style={styles.signOffText}>{data.signOff || 'Sincerely,'}</Text>
          {data.senderName && <Text style={styles.senderSignature}>{data.senderName}</Text>}
        </View>
      </Page>
    </Document>
  );
}
