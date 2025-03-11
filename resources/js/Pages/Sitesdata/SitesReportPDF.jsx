import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 8, // Smaller text
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 5,
  },
  totalSites: {
    fontSize: 10,
    textAlign: "right",
    marginBottom: 5,
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
  },
  tableColHeader: {
    fontSize: 9,
    fontWeight: "bold",
    padding: 2,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
  },
  nameCol: {
    fontSize: 8,
    padding: 2,
    textAlign: "start",
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
  },
  tableCol: {
    fontSize: 8,
    padding: 2,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
  },
});



// PDF Component
const SitesReportPDF = ({ sites = [] }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.section}>
        {/* Report Title */}
        <Text style={styles.title}>Water Quality Report</Text>

        {/* Total Sites Count */}
        <Text style={styles.totalSites}>Total Sites: {sites.length}</Text>

        {/* Table */}
        {sites.length > 0 ? (
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableColHeader, { flex: 2 }]}>Name</Text>
              <Text style={[styles.tableColHeader, { flex: 1 }]}>Status</Text>
              <Text style={[styles.tableColHeader, { flex: 1 }]}>pH Level</Text>
              <Text style={[styles.tableColHeader, { flex: 1 }]}>Salinity (ppt)</Text>
              <Text style={[styles.tableColHeader, { flex: 1 }]}>Turbidity (NTU)</Text>
              <Text style={[styles.tableColHeader, { flex: 1 }]}>TDS (mg/L)</Text>
              <Text style={[styles.tableColHeader, { flex: 1 }]}>Location</Text>
            </View>

            {/* Table Rows */}
            {sites.map((site, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={[styles.nameCol, { flex: 2 }]} numberOfLines={1} ellipsizeMode="tail">
                  {site.name}
                </Text>
                <Text style={[styles.tableCol, { flex: 1 }]}>{site.status}</Text>
                <Text style={[styles.tableCol, { flex: 1 }]}>{site.ph_level}</Text>
                <Text style={[styles.tableCol, { flex: 1 }]}>{site.salinity}</Text>
                <Text style={[styles.tableCol, { flex: 1 }]}>{site.turbidity?.toFixed(1)}</Text>
                <Text style={[styles.tableCol, { flex: 1 }]}>{site.total_dissolved_solids}</Text>
                <Text style={[styles.tableCol, { flex: 1 }]}>{site.address}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text>No data available.</Text>
        )}
      </View>
    </Page>
  </Document>
);



export default SitesReportPDF;
