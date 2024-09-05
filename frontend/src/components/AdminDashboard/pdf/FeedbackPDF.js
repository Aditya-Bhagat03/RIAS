import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Define styles for the PDF document
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    borderCollapse: "collapse",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
    textAlign: "left",
    fontSize: 10,
  },
  tableCellHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  questionCell: {
    width: "90%",
  },
  scoreCell: {
    width: "10%",
    textAlign: "center",
  },
  header: {
    fontSize: 12,
    marginBottom: 10,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  footerLine: {
    marginBottom: 2,
  },
});

<<<<<<< HEAD
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
=======
// Define pages to exclude (1-indexed)
const pagesToExclude = [8, 9, 11, 12];

// Define the maximum number of pages to include
const maxPages = 100;

const FeedbackPDF = ({ feedbacks }) => {
  // Group feedbacks by faculty name
  const groupedByFaculty = feedbacks.reduce((acc, feedback) => {
    if (!acc[feedback.facultyName]) {
      acc[feedback.facultyName] = [];
    }
    acc[feedback.facultyName].push(feedback);
    return acc;
  }, {});

  // Convert grouped feedbacks to an array of entries
  const facultyEntries = Object.entries(groupedByFaculty);

  // Array to hold the pages to be included
  const pages = [];

  let currentPage = 1;

  facultyEntries.forEach(([facultyName, feedbackList], idx) => {
    // Check if the current page is excluded
    if (!pagesToExclude.includes(currentPage) && pages.length < maxPages) {
      // Create page content
      const pageContent = (
        <Page key={currentPage} style={styles.page}>
          <Text style={styles.title}>{facultyName}</Text>
          {["theory", "practical"].map((type) => {
            const feedbackType = feedbackList.filter((fb) => fb.type === type);
            return (
              feedbackType.length > 0 && (
                <View key={type} style={styles.section}>
                  <Text style={styles.header}>
                    {type.charAt(0).toUpperCase() + type.slice(1)} Feedback
                  </Text>
                  <View style={styles.table}>
                    <View style={styles.tableRow}>
                      <Text
                        style={[
                          styles.tableCell,
                          styles.tableCellHeader,
                          styles.questionCell,
                        ]}
                      >
                        Question
                      </Text>
                      <Text
                        style={[
                          styles.tableCell,
                          styles.tableCellHeader,
                          styles.scoreCell,
                        ]}
                      >
                        Average Score
                      </Text>
                    </View>
                    {feedbackType.map((feedback, idx) =>
                      Object.entries(feedback.responses).map(
                        ([question, avgScore], i) => (
                          <View style={styles.tableRow} key={i}>
                            <Text
                              style={[styles.tableCell, styles.questionCell]}
                            >
                              {question}
                            </Text>
                            <Text style={[styles.tableCell, styles.scoreCell]}>
                              {avgScore}
                            </Text>
                          </View>
                        )
                      )
                    )}
                  </View>
                </View>
              )
            );
          })}
          <View style={styles.footer}>
            <Text style={styles.footerLine}>Report generated by RIAS</Text>
            <Text>Developed by CSE Department</Text>
          </View>
        </Page>
      );

      pages.push(pageContent);
    }

    currentPage++;
  });

  return <Document>{pages}</Document>;
>>>>>>> 978e76f0e9bbd9cad0482b66d49a1e48c3b64eb4
};

export default FeedbackPDF;
