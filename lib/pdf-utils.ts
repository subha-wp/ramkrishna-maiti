import React from "react";
import { pdf } from "@react-pdf/renderer";
import SIPPDFDocument from "./pdf-generator-react";

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
  currentAge?: number;
  retirementAge?: number;
}

interface AdvisorInfo {
  name: string;
  phone: string;
  address: string;
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
    img.src = url.startsWith("/") ? url : `/${url}`;
  });
};

// Helper function to capture chart as base64 image
const captureChartAsImage = async (elementId: string): Promise<string | null> => {
  return new Promise((resolve) => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        console.warn(`Element with id ${elementId} not found`);
        resolve(null);
        return;
      }

      // Use html2canvas to capture the chart
      import("html2canvas").then((html2canvas) => {
        html2canvas.default(element, {
          backgroundColor: "#ffffff",
          scale: 2,
          logging: false,
        }).then((canvas) => {
          const base64 = canvas.toDataURL("image/png");
          resolve(base64);
        }).catch((error) => {
          console.warn("Failed to capture chart:", error);
          resolve(null);
        });
      });
    } catch (error) {
      console.warn("Error capturing chart:", error);
      resolve(null);
    }
  });
};

// Calculate scenarios
const calculateScenarios = (
  monthlyAmount: number,
  duration: number
) => {
  const scenarios = [
    { rate: 8, label: "Conservative", color: "blue" },
    { rate: 12, label: "Moderate", color: "green" },
    { rate: 15, label: "Aggressive", color: "purple" },
  ];

  return scenarios.map((scenario) => {
    const monthlyRate = scenario.rate / 100 / 12;
    const totalMonths = duration * 12;
    const maturityAmount =
      monthlyAmount *
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
      (1 + monthlyRate);
    const totalInvestment = monthlyAmount * totalMonths;
    const gains = maturityAmount - totalInvestment;

    return {
      ...scenario,
      maturityAmount: Math.round(maturityAmount),
      gains: Math.round(gains),
    };
  });
};

interface ClientInfo {
  name: string;
  phone: string;
  email: string;
  address?: string;
  goals?: string[];
}

export const generatePDFWithReact = async (
  calculation: SIPCalculation,
  goalPlanning: GoalPlanningData,
  advisorInfo: AdvisorInfo | null,
  currentAge: number,
  retirementAge: number,
  clientInfo?: ClientInfo
) => {
  // Load logo
  let logoBase64: string | undefined;
  try {
    logoBase64 = await loadImageAsBase64("/ramkrishna-maiti.png");
  } catch (error) {
    console.warn("Could not load logo image:", error);
  }

  // Capture charts as images
  let growthChartBase64: string | null = null;
  let pieChartBase64: string | null = null;
  
  // Wait a bit for charts to render
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  try {
    growthChartBase64 = await captureChartAsImage("growth-chart");
  } catch (error) {
    console.warn("Could not capture growth chart:", error);
  }
  
  try {
    pieChartBase64 = await captureChartAsImage("pie-chart");
  } catch (error) {
    console.warn("Could not capture pie chart:", error);
  }

  // Calculate scenarios
  const scenarios = calculateScenarios(
    calculation.monthlyInvestment,
    calculation.duration
  );

  // Create PDF document using React.createElement to avoid JSX in .ts file
  const pdfDoc = React.createElement(SIPPDFDocument, {
    calculation: calculation,
    goalPlanning: {
      ...goalPlanning,
      currentAge: goalPlanning.currentAge ?? currentAge,
      retirementAge: goalPlanning.retirementAge ?? retirementAge,
    },
    scenarios: scenarios,
    advisorInfo: advisorInfo,
    logoBase64: logoBase64,
    clientInfo: clientInfo || null,
    growthChartBase64: growthChartBase64 || undefined,
    pieChartBase64: pieChartBase64 || undefined,
  });

  // Generate PDF blob
  const blob = await pdf(pdfDoc).toBlob();
  const url = URL.createObjectURL(blob);

  // Download PDF
  const link = document.createElement("a");
  link.href = url;
  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  link.download = `SIP_Investment_Plan_${date.replace(/\//g, "_")}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

