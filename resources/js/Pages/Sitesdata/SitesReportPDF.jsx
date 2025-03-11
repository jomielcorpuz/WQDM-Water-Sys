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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Align total sites left & date right
    marginBottom: 5,
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
  addrcol: {
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


const ROWS_PER_PAGE = 20; // Adjust as needed

const chunkArray = (array, size) => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size)
  );
};

// Import date formatting utility
const formatDate = (date) => {
  if (!date) return "N/A"; // Prevents errors if date is null/undefined
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};


const SitesReportPDF = ({ sites = [] }) => {

  const siteChunks = chunkArray(sites, ROWS_PER_PAGE); // Split data into pages
  const currentDate = formatDate(new Date()); // Get today's date

  return (
    <Document>
      {siteChunks.map((chunk, pageIndex) => (
        <Page size="A4" orientation="landscape" style={styles.page} key={pageIndex}>
          <View style={styles.section}>
            {/* Header and Page Indicator */}
            <Text style={styles.title}>Water Quality Report</Text>

            {/* Total Sites & Date Container */}
            <View style={styles.headerRow}>
              <Text style={styles.totalSites}>Total Sites: {sites.length}</Text>
              <Text style={styles.reportDate}>{currentDate}</Text> {/* Date at top right */}
            </View>

            <Text style={{ fontSize: 8, textAlign: "right", marginBottom: 5 }}>
              Page {pageIndex + 1} of {siteChunks.length}
            </Text>

            {/* Table */}
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableRow}>
                <Text style={[styles.tableColHeader, { flex: 2 }]}>Name</Text>
                <Text style={[styles.tableColHeader, { flex: 1 }]}>Status</Text>
                <Text style={[styles.tableColHeader, { flex: 1 }]}>pH Level</Text>
                <Text style={[styles.tableColHeader, { flex: 1 }]}>Salinity (ppt)</Text>
                <Text style={[styles.tableColHeader, { flex: 1 }]}>Turbidity (NTU)</Text>
                <Text style={[styles.tableColHeader, { flex: 1 }]}>TDS (mg/L)</Text>
                <Text style={[styles.tableColHeader, { flex: 1 }]}>Status</Text> {/* New Column */}
                <Text style={[styles.tableColHeader, { flex: 2 }]}>Location</Text>
              </View>

              {/* Table Rows */}
              {chunk.map((site, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={[styles.nameCol, { flex: 2 }]} numberOfLines={1} ellipsizeMode="tail">
                    {site.name.length > 25 ? site.name.substring(0, 25) + "..." : site.name}
                  </Text>
                  <Text style={[styles.tableCol, { flex: 1 }]}>{site.status}</Text>
                  <Text style={[styles.tableCol, { flex: 1 }]}>{site.ph_level}</Text>
                  <Text style={[styles.tableCol, { flex: 1 }]}>{site.salinity}</Text>
                  <Text style={[styles.tableCol, { flex: 1 }]}>{site.turbidity?.toFixed(1)}</Text>
                  <Text style={[styles.tableCol, { flex: 1 }]}>{site.total_dissolved_solids}</Text>
                  <Text style={[styles.tableCol, { flex: 1 }]}>{site.active_status}</Text>

                  <Text style={[styles.addrcol, { flex: 2 }]} numberOfLines={1} ellipsizeMode="tail">
                    {site.address.length > 50 ? site.address.substring(0, 30) + "..." : site.address}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};




export default SitesReportPDF;
