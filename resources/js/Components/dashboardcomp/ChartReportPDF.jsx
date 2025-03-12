import React from "react";
import { Document, Page, Image, Text, View, StyleSheet } from "@react-pdf/renderer";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: { padding: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  chartImage: { width: "100%", height: 300, marginBottom: 10 },
});

// PDF Component
export default function ChartReport({ chartImage }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Water Sites Condition Report</Text>
        <Image style={styles.chartImage} src={chartImage} />
        <Text>Generated on: {new Date().toLocaleDateString()}</Text>
      </Page>
    </Document>
  );
}
