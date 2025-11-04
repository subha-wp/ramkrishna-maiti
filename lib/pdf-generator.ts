// @ts-nocheck
import jsPDF from "jspdf";
import { AdvisorInfo } from "@/components/advisor-setup";

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

// Helper function to load image as base64
const loadImageAsBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        try {
          const base64 = canvas.toDataURL("image/png");
          resolve(base64);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error("Could not get canvas context"));
      }
    };
    img.onerror = reject;
    // For Next.js public folder, use the full path
    img.src = url.startsWith("/") ? url : `/${url}`;
  });
};

// Color constants matching UI design
const COLORS = {
  blue600: [37, 99, 235], // #2563eb
  blue700: [29, 78, 216], // #1d4ed8
  green600: [22, 163, 74], // #16a34a
  green700: [21, 128, 61], // #15803d
  gray50: [249, 250, 251], // #f9fafb
  gray100: [243, 244, 246], // #f3f4f6
  gray200: [229, 231, 235], // #e5e7eb
  gray600: [75, 85, 99], // #4b5563
  gray700: [55, 65, 81], // #374151
  white: [255, 255, 255],
  purple600: [147, 51, 234], // #9333ea
};

// Helper function to create gradient effect (simulated with multiple rectangles)
const drawGradientRect = (
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  color1: number[],
  color2: number[]
) => {
  const steps = 20;
  const stepWidth = width / steps;
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const r = Math.round(color1[0] + (color2[0] - color1[0]) * ratio);
    const g = Math.round(color1[1] + (color2[1] - color1[1]) * ratio);
    const b = Math.round(color1[2] + (color2[2] - color1[2]) * ratio);
    doc.setFillColor(r, g, b);
    doc.rect(x + i * stepWidth, y, stepWidth, height, "F");
  }
};

export const generatePDF = async (
  calculation: SIPCalculation,
  advisorInfo: AdvisorInfo | null
) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPos = margin;

  // Helper function to add a new page if needed
  const checkNewPage = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Load and add logo
  let logoBase64: string | null = null;
  try {
    logoBase64 = await loadImageAsBase64("/ramkrishna-maiti.png");
  } catch (error) {
    console.warn("Could not load logo image:", error);
  }

  // Professional Header with Gradient Background
  const headerHeight = 45;
  drawGradientRect(doc, 0, 0, pageWidth, headerHeight, COLORS.blue600, COLORS.green600);
  
  // Add logo if available
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, "PNG", margin, 8, 18, 18);
    } catch (error) {
      console.warn("Could not add logo to PDF:", error);
    }
  }
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  const titleX = logoBase64 ? margin + 22 : margin;
  doc.text("Professional SIP Calculator", titleX, 20);
  
  // Subtitle
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(255, 255, 255, 0.9);
  doc.text(
    "Plan your systematic investment journey with advanced calculations",
    titleX,
    28
  );

  // Advisor info in header
  if (advisorInfo) {
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255, 0.85);
    doc.text(`Advisor: ${advisorInfo.name}`, margin, 35);
    doc.text(`Phone: ${advisorInfo.phone}`, pageWidth - margin - 50, 35);
    doc.text(`Address: ${advisorInfo.address}`, margin, 40);
  }

  yPos = headerHeight + 10;

  // Key Results Cards - Matching UI Design
  checkNewPage(50);
  
  const cardWidth = (pageWidth - 2 * margin - 10) / 2;
  const cardHeight = 35;
  
  // Maturity Amount Card - Blue Gradient
  drawGradientRect(
    doc,
    margin,
    yPos,
    cardWidth,
    cardHeight,
    COLORS.blue600,
    COLORS.blue700
  );
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Maturity Amount", margin + 5, yPos + 8);
  doc.setFontSize(18);
  doc.text(formatCurrency(calculation.maturityAmount), margin + 5, yPos + 16);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(255, 255, 255, 0.9);
  doc.text(
    `After ${calculation.duration} years of investment`,
    margin + 5,
    yPos + 22
  );

  // Total Gains Card - Green Gradient
  drawGradientRect(
    doc,
    margin + cardWidth + 10,
    yPos,
    cardWidth,
    cardHeight,
    COLORS.green600,
    COLORS.green700
  );
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Total Gains", margin + cardWidth + 15, yPos + 8);
  doc.setFontSize(18);
  doc.text(formatCurrency(calculation.totalGains), margin + cardWidth + 15, yPos + 16);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(255, 255, 255, 0.9);
  const returnPercent = (
    (calculation.totalGains / calculation.totalInvestment) *
    100
  ).toFixed(1);
  doc.text(
    `${returnPercent}% returns`,
    margin + cardWidth + 15,
    yPos + 22
  );

  yPos += cardHeight + 12;

  // Executive Summary Card - White with subtle background
  checkNewPage(60);
  doc.setFillColor(...COLORS.white);
  doc.setDrawColor(...COLORS.gray200);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 50, 3, 3, "FD");
  
  doc.setTextColor(...COLORS.gray700);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", margin + 8, yPos + 10);
  
  yPos += 15;
  
  const summaryData = [
    ["Monthly Investment", formatCurrency(calculation.monthlyInvestment)],
    ["Investment Duration", `${calculation.duration} years`],
    ["Expected Annual Return", `${calculation.expectedReturn}%`],
    ["Total Investment", formatCurrency(calculation.totalInvestment)],
    ["Return Percentage", `${returnPercent}%`],
  ];

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  summaryData.forEach(([label, value], index) => {
    if (index % 2 === 0) {
      doc.setFillColor(...COLORS.gray50);
      doc.roundedRect(margin + 5, yPos - 4, pageWidth - 2 * margin - 10, 6, 2, 2, "F");
    }
    
    doc.setTextColor(...COLORS.gray700);
    doc.setFont("helvetica", "bold");
    doc.text(label + ":", margin + 8, yPos);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.gray600);
    doc.text(value, pageWidth - margin - 50, yPos);
    yPos += 7;
  });

  yPos += 10;
  checkNewPage(40);

  // Key Highlights Section
  doc.setFillColor(...COLORS.white);
  doc.setDrawColor(...COLORS.gray200);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 45, 3, 3, "FD");
  
  doc.setTextColor(...COLORS.gray700);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Key Highlights", margin + 8, yPos + 10);
  
  yPos += 12;
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.gray600);
  
  const highlights = [
    `Your investment of ${formatCurrency(calculation.totalInvestment)} will grow to ${formatCurrency(calculation.maturityAmount)}`,
    `You will earn ${formatCurrency(calculation.totalGains)} in returns over ${calculation.duration} years`,
    `This represents a ${returnPercent}% return on your investment`,
    `With an expected annual return of ${calculation.expectedReturn}%, your wealth will multiply significantly`,
  ];

  highlights.forEach((highlight, index) => {
    doc.setFillColor(...COLORS.blue600);
    doc.circle(margin + 5, yPos - 1, 1.5, "F");
    doc.setTextColor(...COLORS.gray700);
    doc.text(highlight, margin + 10, yPos, { maxWidth: pageWidth - 2 * margin - 15 });
    yPos += 8;
  });

  yPos += 10;
  checkNewPage(50);

  // Year-wise Breakdown Table
  doc.setFillColor(...COLORS.white);
  doc.setDrawColor(...COLORS.gray200);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 30, 3, 3, "FD");
  
  doc.setTextColor(...COLORS.gray700);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Year-wise Investment Growth", margin + 8, yPos + 10);
  
  yPos += 15;

  // Table header with gradient
  const tableHeaderHeight = 8;
  drawGradientRect(
    doc,
    margin + 5,
    yPos - 5,
    pageWidth - 2 * margin - 10,
    tableHeaderHeight,
    COLORS.blue600,
    COLORS.green600
  );
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  
  const colWidths = [15, 38, 38, 38];
  const headers = ["Year", "Invested", "Value", "Gains"];
  let xPos = margin + 8;
  
  headers.forEach((header, index) => {
    doc.text(header, xPos, yPos);
    xPos += colWidths[index];
  });

  yPos += 8;
  doc.setTextColor(...COLORS.gray700);
  doc.setFont("helvetica", "normal");

  // Table rows - show first 10 years or all if less
  const rowsToShow = Math.min(calculation.yearlyBreakdown.length, 10);
  for (let i = 0; i < rowsToShow; i++) {
    const row = calculation.yearlyBreakdown[i];
    checkNewPage(8);
    
    if (i % 2 === 0) {
      doc.setFillColor(...COLORS.gray50);
      doc.roundedRect(margin + 5, yPos - 4, pageWidth - 2 * margin - 10, 6, 1, 1, "F");
    }

    xPos = margin + 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.gray700);
    doc.text(row.year.toString(), xPos, yPos);
    xPos += colWidths[0];
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.gray600);
    doc.text(formatCurrency(row.invested), xPos, yPos);
    xPos += colWidths[1];
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.blue600);
    doc.text(formatCurrency(row.value), xPos, yPos);
    xPos += colWidths[2];
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.green600);
    doc.text(formatCurrency(row.gains), xPos, yPos);
    
    yPos += 6;
  }

  // If more than 10 years, show summary
  if (calculation.yearlyBreakdown.length > 10) {
    yPos += 3;
    checkNewPage(10);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.gray600);
    doc.text(
      `... and ${calculation.yearlyBreakdown.length - 10} more years (see full breakdown in analysis)`,
      margin + 8,
      yPos
    );
  }

  yPos += 10;
  checkNewPage(35);

  // Investment Summary Card
  doc.setFillColor(...COLORS.white);
  doc.setDrawColor(...COLORS.gray200);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 25, 3, 3, "FD");
  
  doc.setTextColor(...COLORS.purple600);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Investment Summary", margin + 8, yPos + 10);
  
  yPos += 12;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  
  const summaryItems = [
    ["Monthly Investment", formatCurrency(calculation.monthlyInvestment)],
    ["Total Investment", formatCurrency(calculation.totalInvestment)],
    ["Investment Period", `${calculation.duration} years`],
  ];

  summaryItems.forEach(([label, value], index) => {
    if (index % 2 === 0) {
      doc.setFillColor(...COLORS.gray50);
      doc.roundedRect(margin + 5, yPos - 4, pageWidth - 2 * margin - 10, 6, 2, 2, "F");
    }
    doc.setTextColor(...COLORS.gray700);
    doc.setFont("helvetica", "bold");
    doc.text(label + ":", margin + 8, yPos);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.gray600);
    doc.text(value, pageWidth - margin - 50, yPos);
    yPos += 6;
  });

  yPos += 10;
  checkNewPage(30);

  // Footer with disclaimer and advisor info
  doc.setFillColor(...COLORS.gray50);
  doc.rect(0, pageHeight - 25, pageWidth, 25, "F");
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...COLORS.gray600);
  doc.text(
    "Note: This is a projection based on the expected return rate. Actual returns may vary. Please consult with your financial advisor before making investment decisions.",
    margin,
    pageHeight - 15,
    { maxWidth: pageWidth - 2 * margin }
  );

  if (advisorInfo) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.gray700);
    doc.setFontSize(9);
    doc.text(`Prepared by: ${advisorInfo.name}`, margin, pageHeight - 8);
    doc.text(`Contact: ${advisorInfo.phone}`, pageWidth - margin - 50, pageHeight - 8);
  }

  // Add page numbers with gradient
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.gray600);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin - 20,
      pageHeight - 8
    );
  }

  // Generate filename
  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const filename = `SIP_Investment_Plan_${date.replace(/\//g, "_")}.pdf`;

  doc.save(filename);
};
