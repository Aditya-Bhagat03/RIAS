import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Define styles for the PDF document
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    borderCollapse: 'collapse',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 8,
    textAlign: 'center',
    fontSize: 11,
    width: '14%', // Adjusted for better fit
    minWidth: 60,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCellHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#e0e0e0',
  },
  averagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  averageText: {
    flex: 1,
    textAlign: 'center',
  },
});

// Create Document Component
const FeedbackPDFsame = ({ analysisData }) => {
  const calculateFinalAveragePercentage = (data) => {
    if (data.length === 0) return '0.00';
    const totalPercentage = data.reduce((sum, item) => sum + parseFloat(item.averagePercentage), 0);
    return (totalPercentage / data.length).toFixed(2);
  };

  const theoryData = analysisData.filter(data => data.type.toLowerCase() === 'theory');
  const practicalData = analysisData.filter(data => data.type.toLowerCase() === 'practical');

  const finalTheoryAverage = calculateFinalAveragePercentage(theoryData);
  const finalPracticalAverage = calculateFinalAveragePercentage(practicalData);
  const finalOverallAverage = ((parseFloat(finalTheoryAverage) + parseFloat(finalPracticalAverage)) / 2).toFixed(2);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Feedback Analysis Report</Text>

          <View style={styles.averagesContainer}>
            <Text style={styles.averageText}>Final Overall Average: {finalOverallAverage}%</Text>
            <Text style={styles.averageText}>Theory Average: {finalTheoryAverage}%</Text>
            <Text style={styles.averageText}>Practical Average: {finalPracticalAverage}%</Text>
          </View>

          <Text style={styles.title}>Theory Subjects</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.tableCellHeader]}><Text>Faculty Name</Text></View>
              <View style={[styles.tableCell, styles.tableCellHeader]}><Text>Subject Name</Text></View>
              <View style={[styles.tableCell, styles.tableCellHeader]}><Text>Branch</Text></View>
              <View style={[styles.tableCell, styles.tableCellHeader]}><Text>Type</Text></View>
              <View style={[styles.tableCell, styles.tableCellHeader]}><Text>Average Rating</Text></View>
              <View style={[styles.tableCell, styles.tableCellHeader]}><Text>Average Percentage</Text></View>
              <View style={[styles.tableCell, styles.tableCellHeader]}><Text>Feedback Remark</Text></View>
            </View>
            {theoryData.map((data, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCell}><Text>{data.facultyName}</Text></View>
                <View style={styles.tableCell}><Text>{data.subjectName}</Text></View>
                <View style={styles.tableCell}><Text>{data.branch}</Text></View>
                <View style={styles.tableCell}><Text>{data.type}</Text></View>
                <View style={styles.tableCell}><Text>{data.averageRating}</Text></View>
                <View style={styles.tableCell}><Text>{data.averagePercentage}%</Text></View>
                <View style={styles.tableCell}><Text>{getFeedbackRemark(data.averagePercentage)}</Text></View>
              </View>
            ))}
          </View>

          <Text style={styles.title}>Practical Subjects</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.tableCellHeader]}><Text>Faculty Name</Text></View>
              <View style={[styles.tableCell, styles.tableCellHeader]}><Text>Subject Name</Text></View>
              <View style={[styles.tableCell, styles.tableCellHeader]}><Text>Branch</Text></View>
              <View style={[styles.tableCell, styles.tableCellHeader]}><Text>Type</Text></View>
              <View style={[styles.tableCell, styles.tableCellHeader]}><Text>Average Rating</Text></View>
              <View style={[styles.tableCell, styles.tableCellHeader]}><Text>Average Percentage</Text></View>
              <View style={[styles.tableCell, styles.tableCellHeader]}><Text>Feedback Remark</Text></View>
            </View>
            {practicalData.map((data, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCell}><Text>{data.facultyName}</Text></View>
                <View style={styles.tableCell}><Text>{data.subjectName}</Text></View>
                <View style={styles.tableCell}><Text>{data.branch}</Text></View>
                <View style={styles.tableCell}><Text>{data.type}</Text></View>
                <View style={styles.tableCell}><Text>{data.averageRating}</Text></View>
                <View style={styles.tableCell}><Text>{data.averagePercentage}%</Text></View>
                <View style={styles.tableCell}><Text>{getFeedbackRemark(data.averagePercentage)}</Text></View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

const getFeedbackRemark = (percentage) => {
  if (percentage >= 90) return "Excellent";
  if (percentage >= 80) return "Very Good";
  if (percentage >= 70) return "Good";
  if (percentage >= 60) return "Satisfactory";
  
  return "Need Improvement";
};

export default FeedbackPDFsame;