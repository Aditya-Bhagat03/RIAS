import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 15,
  },
  header: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  text: {
    fontSize: 8,
    marginBottom: 3,
  },
  table: {
    display: 'table',
    width: '100%',
    margin: '8px 0',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 3,
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'table-row',
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableRow: {
    display: 'table-row',
  },
  tableCell: {
    display: 'table-cell',
    padding: 4,
    borderColor: '#ddd',
    borderStyle: 'solid',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 8,
  },
  tableHeaderCell: {
    backgroundColor: '#f0f0f0',
    fontSize: 10,
  },
  infoTable: {
    display: 'table',
    width: '100%',
    margin: '8px 0',
  },
  infoRow: {
    display: 'table-row',
  },
  infoCell: {
    display: 'table-cell',
    padding: 4,
    borderColor: '#ddd',
    borderStyle: 'solid',
    borderWidth: 1,
    textAlign: 'left',
    fontSize: 8,
    width: '33%',
  },
  feedbackTable: {
    display: 'table',
    width: '100%',
    margin: '8px 0',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 3,
    overflow: 'hidden',
  },
  feedbackHeader: {
    display: 'table-row',
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  feedbackRow: {
    display: 'table-row',
  },
  feedbackCell: {
    display: 'table-cell',
    padding: 4,
    borderColor: '#ddd',
    borderStyle: 'solid',
    borderWidth: 1,
    fontSize: 8,
  },
});

const FeedbackPDF = ({ feedbacks, analysisData }) => {
  console.log('Feedbacks in PDF:', feedbacks);
  console.log('Analysis Data in PDF:', analysisData);

  return (
    <Document>
      {feedbacks.map((feedback, feedbackIndex) => (
        <Page size="A4" style={styles.page} key={feedbackIndex}>
          <View style={styles.section}>
            <Text style={styles.header}>Faculty Feedback Report</Text>
            <View style={styles.infoTable}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoCell, { fontWeight: 'bold' }]}>Faculty Name</Text>
                <Text style={[styles.infoCell, { fontWeight: 'bold' }]}>Type</Text>
                <Text style={[styles.infoCell, { fontWeight: 'bold' }]}>Subject</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoCell}>{feedback.facultyName}</Text>
                <Text style={styles.infoCell}>{feedback.type}</Text>
                <Text style={styles.infoCell}>{feedback.subjectName}</Text>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.feedbackTable}>
              <View style={styles.feedbackHeader}>
                <Text style={[styles.feedbackCell, { fontWeight: 'bold', textAlign: 'left' }]}>Question</Text>
                <Text style={[styles.feedbackCell, { fontWeight: 'bold' }]}>Average Score</Text>
              </View>
              {Object.entries(analysisData.questionAverages).map(([question, avg], index) => (
                question.startsWith(`${feedbackIndex}_`) && (
                  <View style={styles.feedbackRow} key={index}>
                    <Text style={styles.feedbackCell}>{question.split('_').slice(1).join('_')}</Text>
                    <Text style={styles.feedbackCell}>
                      {avg !== undefined && avg !== null && !isNaN(avg)
                        ? parseFloat(avg).toFixed(2)
                        : 'N/A'}
                    </Text>
                  </View>
                )
              ))}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default FeedbackPDF;
