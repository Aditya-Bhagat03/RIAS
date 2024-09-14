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
  section: { marginBottom: 10 },
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
  tableRow: { flexDirection: "row" },
  tableCell: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
    textAlign: "left",
    fontSize: 10,
  },
  tableCellHeader: { backgroundColor: "#f0f0f0", fontWeight: "bold" },
  questionCell: { width: "70%" },
  scoreCell: { width: "30%", textAlign: "center" },
  header: { fontSize: 12, marginBottom: 10, fontWeight: "bold" },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  footerLine: { marginBottom: 2 },
  facultyName: { fontSize: 12, fontWeight: "bold" },
});


// Helper function to calculate the percentage
const calculatePercentage = (score, total = 4) => {
  if (total === 0) return "N/A"; // Handle division by zero
  return ((score / total) * 100).toFixed(0) + "%";
};



// Define the PDF component
const FeedbackPDF = ({ data }) => {
  const { theory, practical } = data;

  // Ensure that theory and practical are arrays
  const theoryArray = Array.isArray(theory) ? theory : [];
  const practicalArray = Array.isArray(practical) ? practical : [];

  // Combine theory and practical feedback for each faculty member
  const combinedFeedback = {};
  theoryArray.forEach(item => {
    if (!combinedFeedback[item.facultyName]) {
      combinedFeedback[item.facultyName] = { theory: item, practical: [] };
    } else {
      combinedFeedback[item.facultyName].theory = item;
    }
  });

  practicalArray.forEach(item => {
    if (combinedFeedback[item.facultyName]) {
      combinedFeedback[item.facultyName].practical.push(item);
    } else {
      combinedFeedback[item.facultyName] = { theory: null, practical: [item] };
    }
  });

 // Calculate final average
 const calculateFinalAverage = (theoryAverage, practicalArray) => {
  const practicalAverages = practicalArray.map(item => parseFloat(item.practicalAverage.replace('%', '')));
  const practicalAverage = practicalAverages.length > 0 ? practicalAverages.reduce((acc, avg) => acc + avg, 0) / practicalAverages.length : null;
  if (theoryAverage !== null && practicalAverage !== null) {
    return calculatePercentage((parseFloat(theoryAverage.replace('%', '')) + practicalAverage) / 50);
  }
  return theoryAverage !== null ? theoryAverage : practicalAverage;
};

  return (
    <Document>
      {Object.keys(combinedFeedback).map(facultyName => {
         const feedback = combinedFeedback[facultyName];
         const theoryAverage = feedback.theory ? feedback.theory.theoryAverage : null;
         const finalAverage = calculateFinalAverage(theoryAverage, feedback.practical);
        return (
          <Page key={facultyName} style={styles.page}>
            <View style={styles.section}>
              <Text style={styles.header}>Feedback Statistics</Text>
              <Text style={styles.facultyName}>
                Faculty: {facultyName}
              </Text>

              {/* Theory Feedback */}
              {feedback.theory && (
                <View style={styles.section}>
                  <Text style={styles.title}>Theory Feedback</Text>
                  <Text>Subjects: {feedback.theory.subjectNames.join(", ")}</Text>
                  <Text>Theory Average: {feedback.theory.theoryAverage}</Text>
                  <Text>Final Average: {finalAverage ? finalAverage : "N/A"}</Text>
                  
                  

                  <View style={styles.table}>
                    <View style={styles.tableRow}>
                      <Text style={[styles.tableCell, styles.tableCellHeader, styles.questionCell]}>
                        Question
                      </Text>
                      {feedback.theory.subjectNames.map((subject, index) => (
                        <Text key={index} style={[styles.tableCell, styles.tableCellHeader, styles.scoreCell]}>
                          {subject}
                        </Text>
                      ))}
                    </View>
                    {Object.entries(feedback.theory.responses).map(([question, responses]) => (
                      <View key={question} style={styles.tableRow}>
                        <Text style={[styles.tableCell, styles.questionCell]}>
                          {question}
                        </Text>
                        {responses.map((response, index) => (
                          <Text key={index} style={[styles.tableCell, styles.scoreCell]}>
                            {response}
                          </Text>
                        ))}
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Practical Feedback */}
              {feedback.practical.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.title}>Practical Feedback</Text>
                  {feedback.practical.map((item, index) => (
                    <View key={index}>
                      <Text>Subjects: {item.subjectNames.join(", ")}</Text>
                      <Text>Practical Average: {item.practicalAverage}</Text>
                      

                      <View style={styles.table}>
                        <View style={styles.tableRow}>
                          <Text style={[styles.tableCell, styles.tableCellHeader, styles.questionCell]}>
                            Question
                          </Text>
                          {item.subjectNames.map((subject, index) => (
                            <Text key={index} style={[styles.tableCell, styles.tableCellHeader, styles.scoreCell]}>
                              {subject}
                            </Text>
                          ))}
                        </View>
                        {Object.entries(item.responses).map(([question, responses]) => (
                          <View key={question} style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.questionCell]}>
                              {question}
                            </Text>
                            {responses.map((response, index) => (
                              <Text key={index} style={[styles.tableCell, styles.scoreCell]}>
                                {response}
                              </Text>
                            ))}
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              )}

             
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerLine}>Generated by RIAS System</Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default FeedbackPDF;
