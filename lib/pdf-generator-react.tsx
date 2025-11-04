// @ts-nocheck
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Color constants matching UI design (converted to RGB for React PDF compatibility)
const colors = {
  blue600: "#2563eb",
  blue700: "#1d4ed8",
  green600: "#16a34a",
  green700: "#15803d",
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray600: "#4b5563",
  gray700: "#374151",
  white: "#ffffff",
  purple600: "#9333ea",
  red600: "#dc2626",
};

const styles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: "#f9fafb",
    fontFamily: "Helvetica",
  },
  header: {
    backgroundColor: colors.blue600,
    padding: 20,
    paddingBottom: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 25,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 10,
    color: colors.white,
    opacity: 0.9,
  },
  advisorInfo: {
    fontSize: 9,
    color: colors.white,
    opacity: 0.85,
    marginTop: 8,
    flexDirection: "row",
  },
  section: {
    margin: 15,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.gray700,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  keyResultsContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  keyResultCard: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    minHeight: 80,
  },
  maturityCard: {
    backgroundColor: colors.blue600,
  },
  gainsCard: {
    backgroundColor: colors.green600,
  },
  keyResultLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 8,
  },
  keyResultValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 5,
  },
  keyResultSubtext: {
    fontSize: 8,
    color: colors.white,
    opacity: 0.9,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 2,
    backgroundColor: colors.gray50,
    borderRadius: 4,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.gray700,
  },
  summaryValue: {
    fontSize: 10,
    color: colors.gray600,
  },
  highlightItem: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  highlightBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.blue600,
    marginRight: 8,
    marginTop: 4,
  },
  highlightText: {
    fontSize: 9.5,
    color: colors.gray700,
    flex: 1,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.blue600,
    padding: 8,
    borderRadius: 4,
    marginBottom: 2,
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.white,
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    marginBottom: 2,
    backgroundColor: colors.gray50,
    borderRadius: 2,
  },
  tableCell: {
    fontSize: 9,
    color: colors.gray700,
    flex: 1,
  },
  tableCellBold: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.gray700,
    flex: 1,
  },
  tableCellGreen: {
    fontSize: 9,
    color: colors.green600,
    flex: 1,
  },
  tableCellBlue: {
    fontSize: 9,
    color: colors.blue600,
    fontWeight: "bold",
    flex: 1,
  },
  goalCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  scenarioContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  scenarioCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.gray200,
    backgroundColor: colors.white,
  },
  scenarioBadge: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    padding: 5,
    borderRadius: 4,
  },
  scenarioValue: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: colors.gray700,
  },
  scenarioLabel: {
    fontSize: 9,
    color: colors.gray600,
    textAlign: "center",
    marginBottom: 8,
  },
  scenarioGains: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.green600,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 15,
    right: 15,
    padding: 15,
    backgroundColor: colors.gray50,
    borderRadius: 8,
    fontSize: 8,
    color: colors.gray600,
    fontStyle: "italic",
    textAlign: "center",
  },
  pageNumber: {
    position: "absolute",
    bottom: 10,
    right: 20,
    fontSize: 8,
    color: colors.gray600,
  },
});

interface SIPCalculation {
  monthlyInvestment: number;
  totalInvestment: number;
  maturityAmount: number;
  totalGains: number;
  duration: number;
  expectedReturn: number;
  yearlyBreakdown: Array<{
    year: number;
    invested: number;
    value: number;
    gains: number;
  }>;
}

interface GoalPlanningData {
  targetAmount: number;
  requiredSIP: number;
  shortfall: number;
  currentAge: number;
  retirementAge: number;
}

interface AdvisorInfo {
  name: string;
  phone: string;
  address: string;
}

interface ClientInfo {
  name: string;
  phone: string;
  email: string;
  address?: string;
  goals?: string[];
}

interface PDFDocumentProps {
  calculation: SIPCalculation;
  goalPlanning: GoalPlanningData;
  scenarios: Array<{
    rate: number;
    label: string;
    color: string;
    maturityAmount: number;
    gains: number;
  }>;
  advisorInfo: AdvisorInfo | null;
  logoBase64?: string;
  clientInfo?: ClientInfo | null;
  growthChartBase64?: string;
  pieChartBase64?: string;
}

const formatCurrency = (amount: number) => {
  // Use "Rs." prefix instead of ₹ symbol to avoid font encoding issues
  return `Rs. ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
};

const SIPPDFDocument: React.FC<PDFDocumentProps> = ({
  calculation,
  goalPlanning,
  scenarios,
  advisorInfo,
  logoBase64,
  clientInfo,
  growthChartBase64,
  pieChartBase64,
}) => {
  const returnPercent = (
    (calculation.totalGains / calculation.totalInvestment) *
    100
  ).toFixed(2);

  return (
    <Document>
      {/* Page 1: Calculator & Executive Summary */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {logoBase64 && (
            <Image src={logoBase64} style={styles.logo} />
          )}
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Professional SIP Calculator</Text>
            <Text style={styles.headerSubtitle}>
              Plan your systematic investment journey with advanced calculations
            </Text>
            {clientInfo && (
              <View style={styles.advisorInfo}>
                <Text style={{ fontSize: 10, fontWeight: "bold", marginTop: 5 }}>
                  Client: {clientInfo.name}
                </Text>
                <Text style={{ fontSize: 9, marginTop: 2 }}>
                  Phone: {clientInfo.phone} | Email: {clientInfo.email}
                </Text>
                {clientInfo.address && (
                  <Text style={{ fontSize: 9, marginTop: 2 }}>
                    Address: {clientInfo.address}
                  </Text>
                )}
                {clientInfo.goals && clientInfo.goals.length > 0 && (
                  <Text style={{ fontSize: 9, marginTop: 2, fontWeight: "bold" }}>
                    Investment Goals: {clientInfo.goals.join(", ")}
                  </Text>
                )}
              </View>
            )}
            {advisorInfo && (
              <View style={[styles.advisorInfo, { marginTop: clientInfo ? 5 : 8 }]}>
                <Text>Advisor: {advisorInfo.name} | </Text>
                <Text>Phone: {advisorInfo.phone} | </Text>
                <Text>Address: {advisorInfo.address}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          {/* Key Results Cards */}
          <View style={styles.keyResultsContainer}>
            <View style={[styles.keyResultCard, styles.maturityCard]}>
              <Text style={styles.keyResultLabel}>Maturity Amount</Text>
              <Text style={styles.keyResultValue}>
                {formatCurrency(calculation.maturityAmount)}
              </Text>
              <Text style={styles.keyResultSubtext}>
                After {calculation.duration} years of investment
              </Text>
            </View>
            <View style={[styles.keyResultCard, styles.gainsCard]}>
              <Text style={styles.keyResultLabel}>Total Gains</Text>
              <Text style={styles.keyResultValue}>
                {formatCurrency(calculation.totalGains)}
              </Text>
              <Text style={styles.keyResultSubtext}>
                {returnPercent}% returns
              </Text>
            </View>
          </View>

          {/* Executive Summary */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Executive Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Monthly Investment:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(calculation.monthlyInvestment)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Investment Duration:</Text>
              <Text style={styles.summaryValue}>
                {calculation.duration} years
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Expected Annual Return:</Text>
              <Text style={styles.summaryValue}>
                {calculation.expectedReturn}%
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Investment:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(calculation.totalInvestment)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Return Percentage:</Text>
              <Text style={styles.summaryValue}>{returnPercent}%</Text>
            </View>
          </View>

          {/* Key Highlights */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Key Highlights</Text>
            <View style={styles.highlightItem}>
              <View style={styles.highlightBullet} />
              <Text style={styles.highlightText}>
                Your investment of {formatCurrency(calculation.totalInvestment)}{" "}
                will grow to {formatCurrency(calculation.maturityAmount)}
              </Text>
            </View>
            <View style={styles.highlightItem}>
              <View style={styles.highlightBullet} />
              <Text style={styles.highlightText}>
                You will earn {formatCurrency(calculation.totalGains)} in returns
                over {calculation.duration} years
              </Text>
            </View>
            <View style={styles.highlightItem}>
              <View style={styles.highlightBullet} />
              <Text style={styles.highlightText}>
                This represents a {returnPercent}% return on your investment
              </Text>
            </View>
            <View style={styles.highlightItem}>
              <View style={styles.highlightBullet} />
              <Text style={styles.highlightText}>
                With an expected annual return of {calculation.expectedReturn}%,
                your wealth will multiply significantly
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>

      {/* Page 2: Analysis - Year-wise Breakdown */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {/* Growth Chart */}
          {growthChartBase64 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Investment Growth Over Time</Text>
              <Image
                src={growthChartBase64}
                style={{
                  width: "100%",
                  height: 150,
                  marginTop: 10,
                }}
              />
            </View>
          )}

          {/* Pie Chart */}
          {pieChartBase64 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Investment Distribution</Text>
              <Image
                src={pieChartBase64}
                style={{
                  width: "100%",
                  height: 120,
                  marginTop: 10,
                }}
              />
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Year-wise Investment Growth</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Year</Text>
                <Text style={styles.tableHeaderText}>Invested</Text>
                <Text style={styles.tableHeaderText}>Value</Text>
                <Text style={styles.tableHeaderText}>Gains</Text>
              </View>
              {calculation.yearlyBreakdown.map((row, index) => (
                <View
                  key={row.year}
                  style={[
                    styles.tableRow,
                    { backgroundColor: index % 2 === 0 ? colors.gray50 : colors.white },
                  ]}
                >
                  <Text style={styles.tableCellBold}>{row.year}</Text>
                  <Text style={styles.tableCell}>
                    {formatCurrency(row.invested)}
                  </Text>
                  <Text style={styles.tableCellBlue}>
                    {formatCurrency(row.value)}
                  </Text>
                  <Text style={styles.tableCellGreen}>
                    {formatCurrency(row.gains)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Investment Summary */}
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { color: colors.purple600 }]}>
              Investment Summary
            </Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Monthly Investment:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(calculation.monthlyInvestment)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Investment:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(calculation.totalInvestment)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Investment Period:</Text>
              <Text style={styles.summaryValue}>
                {calculation.duration} years
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>

      {/* Page 3: Goal Planning */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Goal Planning</Text>
            
            {/* Target Amount Box */}
            <View
              style={{
                backgroundColor: colors.gray50,
                padding: 20,
                borderRadius: 8,
                marginBottom: 15,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  color: colors.gray700,
                  marginBottom: 5,
                  textAlign: "center",
                }}
              >
                {formatCurrency(goalPlanning.targetAmount)}
              </Text>
              <Text style={{ fontSize: 10, color: colors.gray600, textAlign: "center" }}>
                Target Amount
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginBottom: 15 }}>
              <View
                style={{
                  padding: 12,
                  backgroundColor: colors.gray50,
                  borderRadius: 8,
                  flex: 1,
                  marginRight: 5,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 5,
                    color: colors.blue600,
                    textAlign: "center",
                  }}
                >
                  {goalPlanning.retirementAge && goalPlanning.currentAge
                    ? `${goalPlanning.retirementAge - goalPlanning.currentAge} years`
                    : "N/A"}
                </Text>
                <Text style={{ fontSize: 10, color: colors.gray600, textAlign: "center" }}>
                  Time Available
                </Text>
              </View>
              <View
                style={{
                  padding: 12,
                  backgroundColor: colors.gray50,
                  borderRadius: 8,
                  flex: 1,
                  marginLeft: 5,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 5,
                    color: colors.green600,
                    textAlign: "center",
                  }}
                >
                  {calculation.expectedReturn}%
                </Text>
                <Text style={{ fontSize: 10, color: colors.gray600, textAlign: "center" }}>
                  Expected Return
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 8,
                paddingHorizontal: 10,
                marginBottom: 2,
                backgroundColor: "#dbeafe",
                borderRadius: 4,
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: "bold", color: colors.gray700 }}>
                Required Monthly SIP:
              </Text>
              <Text style={{ fontSize: 10, color: colors.blue600, fontWeight: "bold" }}>
                {formatCurrency(goalPlanning.requiredSIP)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 8,
                paddingHorizontal: 10,
                marginBottom: 2,
                backgroundColor: colors.gray50,
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: "bold", color: colors.gray700 }}>
                Current Monthly SIP:
              </Text>
              <Text style={{ fontSize: 10, color: colors.gray600 }}>
                {formatCurrency(calculation.monthlyInvestment)}
              </Text>
            </View>
            {goalPlanning.shortfall > 0 ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  marginTop: 8,
                  backgroundColor: "#fee2e2",
                  borderRadius: 4,
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: "bold", color: colors.gray700 }}>
                  Monthly Shortfall:
                </Text>
                <Text style={{ fontSize: 10, color: colors.red600, fontWeight: "bold" }}>
                  {formatCurrency(goalPlanning.shortfall)}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  marginTop: 8,
                  backgroundColor: "#d1fae5",
                  borderRadius: 4,
                }}
              >
                <Text style={{ fontSize: 10, color: colors.green600, fontWeight: "bold" }}>
                  🎉 You're on track to achieve your goal!
                </Text>
              </View>
            )}
          </View>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>

      {/* Page 4: Scenarios */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Return Rate Scenarios</Text>
            <View style={styles.scenarioContainer}>
              {scenarios.map((scenario, index) => (
                <View key={index} style={[styles.scenarioCard, { marginRight: index < scenarios.length - 1 ? 5 : 0, marginLeft: index > 0 ? 5 : 0 }]}>
                  <Text
                    style={[
                      styles.scenarioBadge,
                      {
                        color:
                          scenario.color === "blue"
                            ? colors.blue600
                            : scenario.color === "green"
                            ? colors.green600
                            : colors.purple600,
                        backgroundColor:
                          scenario.color === "blue"
                            ? "#dbeafe"
                            : scenario.color === "green"
                            ? "#d1fae5"
                            : "#f3e8ff",
                      },
                    ]}
                  >
                    {scenario.label} - {scenario.rate}%
                  </Text>
                  <Text style={styles.scenarioValue}>
                    {formatCurrency(scenario.maturityAmount)}
                  </Text>
                  <Text style={styles.scenarioLabel}>Maturity Amount</Text>
                  <Text style={styles.scenarioGains}>
                    {formatCurrency(scenario.gains)}
                  </Text>
                  <Text style={styles.scenarioLabel}>Total Gains</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Note: This is a projection based on the expected return rate. Actual
            returns may vary. Please consult with your financial advisor before
            making investment decisions.
          </Text>
          {clientInfo && (
            <Text style={{ marginTop: 8, fontSize: 9, color: colors.gray700, fontWeight: "bold" }}>
              Prepared for: {clientInfo.name} ({clientInfo.email})
            </Text>
          )}
          {advisorInfo && (
            <Text style={{ marginTop: 5, fontSize: 9, color: colors.gray700 }}>
              Prepared by: {advisorInfo.name} | Contact: {advisorInfo.phone}
            </Text>
          )}
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export default SIPPDFDocument;

