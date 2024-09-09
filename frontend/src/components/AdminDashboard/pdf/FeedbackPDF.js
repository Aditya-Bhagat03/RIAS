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
    width: "70%",
  },
  scoreCell: {
    width: "30%",
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  facultyName: {
    fontSize: 12,
    fontWeight: "bold",
  },
  finalAverage: {
    fontSize: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  finalTotalText: {
    marginRight: 10, // Add space to the right of the Final Total
  },
  theoryText: {
    marginRight: 10, // Add space to the right of the Theory
  },
  practicalText: {
    marginRight: 0, // No extra space after Practical
  },
});

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

  facultyEntries.forEach(([facultyName, feedbackList]) => {
    // Calculate final totals
    const totalTheory = feedbackList.filter((fb) => fb.type === "theory");
    const totalPractical = feedbackList.filter((fb) => fb.type === "practical");

    const avgTheory =
      totalTheory.length > 0
        ? totalTheory.reduce((acc, feedback) => acc + feedback.finalTotal, 0) /
          totalTheory.length
        : 0;

    const avgPractical =
      totalPractical.length > 0
        ? totalPractical.reduce((acc, feedback) => acc + feedback.finalTotal, 0) /
          totalPractical.length
        : 0;

    // Determine final total based on available data
    const finalTotal =
      avgTheory > 0 && avgPractical > 0
        ? (avgTheory + avgPractical) / 2
        : avgTheory > 0
        ? avgTheory
        : avgPractical > 0
        ? avgPractical
        : null;

    if (finalTotal !== null) {
      // Create page content
      const pageContent = (
        <Page key={currentPage} style={styles.page}>
          <View style={styles.row}>
            <Text style={styles.facultyName}>{facultyName}</Text>
            <View style={styles.finalAverage}>
              <Text style={styles.finalTotalText}>
                Final Total: {finalTotal.toFixed(2)}%
              </Text>
              {avgTheory > 0 && (
                <Text style={styles.theoryText}>
                  Theory: {avgTheory.toFixed(2)}%
                </Text>
              )}
              {avgPractical > 0 && (
                <Text style={styles.practicalText}>
                  Practical: {avgPractical.toFixed(2)}%
                </Text>
              )}
            </View>
          </View>
          {avgTheory > 0 && (
            <View style={styles.section}>
              <Text style={styles.header}>Theory Feedback</Text>
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
                {totalTheory.map((feedback, idx) =>
                  Object.entries(feedback.responses).map(
                    ([question, avgScore], i) => (
                      <View style={styles.tableRow} key={i}>
                        <Text style={[styles.tableCell, styles.questionCell]}>
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
          )}
          {avgPractical > 0 && (
            <View style={styles.section}>
              <Text style={styles.header}>Practical Feedback</Text>
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
                {totalPractical.map((feedback, idx) =>
                  Object.entries(feedback.responses).map(
                    ([question, avgScore], i) => (
                      <View style={styles.tableRow} key={i}>
                        <Text style={[styles.tableCell, styles.questionCell]}>
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
          )}
          <View style={styles.footer}>
            <Text style={styles.footerLine}>Report generated by RIAS</Text>
            <Text>Developed by CSE Department</Text>
          </View>
        </Page>
      );

      pages.push(pageContent);
      currentPage++;
    }
  });

  return <Document>{pages}</Document>;
};

export default FeedbackPDF;