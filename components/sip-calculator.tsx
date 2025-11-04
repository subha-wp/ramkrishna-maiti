"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  TrendingUp,
  PieChartIcon as PieIcon,
  Download,
  Target,
  DollarSign,
  ArrowUp,
  BarChart3,
} from "lucide-react";
import { generatePDFWithReact } from "@/lib/pdf-utils";
import { getAdvisorInfo } from "@/components/advisor-setup";
import { ClientInfoDialog, type ClientInfo } from "@/components/client-info-dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface SIPCalculation {
  monthlyInvestment: number;
  totalInvestment: number;
  maturityAmount: number;
  totalGains: number;
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
}

const SIPCalculator = () => {
  // Basic inputs
  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [duration, setDuration] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);

  // Advanced options
  const [stepUpEnabled, setStepUpEnabled] = useState(false);
  const [stepUpPercentage, setStepUpPercentage] = useState(10);
  const [lumpSumAmount, setLumpSumAmount] = useState(0);
  const [inflationRate, setInflationRate] = useState(6);

  // Goal planning
  const [targetAmount, setTargetAmount] = useState(1000000);
  const [currentAge, setCurrentAge] = useState(25);
  const [retirementAge, setRetirementAge] = useState(60);

  // UI states
  const [activeTab, setActiveTab] = useState("calculator");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showClientDialog, setShowClientDialog] = useState(false);

  // Calculate SIP with step-up using monthly compounding and cumulative year-wise breakdown
  const calculateSIP = useMemo((): SIPCalculation => {
    const monthlyRate = expectedReturn / 100 / 12;
    let currentMonthlyAmount = monthlyAmount;
    let totalInvestment = 0;
    let balance = lumpSumAmount; // start with lump sum invested at time 0
    const yearlyBreakdown: SIPCalculation["yearlyBreakdown"] = [];

    // include lump sum in invested total
    if (lumpSumAmount > 0) {
      totalInvestment += lumpSumAmount;
    }

    for (let year = 1; year <= duration; year++) {
      for (let month = 1; month <= 12; month++) {
        // grow existing balance, then add this month's SIP
        balance = balance * (1 + monthlyRate) + currentMonthlyAmount;
        totalInvestment += currentMonthlyAmount;
      }

      const yearEndValue = Math.round(balance);
      const investedSoFar = Math.round(totalInvestment);
      yearlyBreakdown.push({
        year,
        invested: investedSoFar,
        value: yearEndValue,
        gains: yearEndValue - investedSoFar,
      });

      // Step up SIP amount for the next year, if enabled
      if (stepUpEnabled && year < duration) {
        currentMonthlyAmount = Math.round(
          currentMonthlyAmount * (1 + stepUpPercentage / 100)
        );
      }
    }

    const maturityAmount = Math.round(balance);

    return {
      monthlyInvestment: monthlyAmount,
      totalInvestment: Math.round(totalInvestment),
      maturityAmount,
      totalGains: maturityAmount - Math.round(totalInvestment),
      yearlyBreakdown,
    };
  }, [
    monthlyAmount,
    duration,
    expectedReturn,
    stepUpEnabled,
    stepUpPercentage,
    lumpSumAmount,
  ]);

  // Goal planning calculation
  const goalPlanning = useMemo((): GoalPlanningData => {
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = duration * 12;

    const requiredSIP =
      targetAmount /
      (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
        (1 + monthlyRate));

    const shortfall = Math.max(0, requiredSIP - monthlyAmount);

    return {
      targetAmount,
      requiredSIP: Math.round(requiredSIP),
      shortfall: Math.round(shortfall),
    };
  }, [targetAmount, duration, expectedReturn, monthlyAmount]);

  // Chart data
  const chartData = calculateSIP.yearlyBreakdown.map((item) => ({
    year: `Year ${item.year}`,
    invested: item.invested,
    value: item.value,
    gains: item.gains,
  }));

  const pieData = [
    {
      name: "Total Investment",
      value: calculateSIP.totalInvestment,
      color: "#3b82f6",
    },
    { name: "Total Gains", value: calculateSIP.totalGains, color: "#10b981" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  return (
    <div
      id="sip-cal"
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-green-600 rounded-full">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Professional SIP Calculator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Plan your systematic investment journey with advanced calculations,
            goal planning, and detailed analysis
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:mx-auto">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Goal Planning
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Scenarios
            </TabsTrigger>
          </TabsList>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Input Panel */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      Investment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Monthly SIP Amount */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Monthly SIP Amount
                      </Label>
                      <div className="space-y-2">
                        <Input
                          type="number"
                          value={monthlyAmount}
                          onChange={(e) =>
                            setMonthlyAmount(Number(e.target.value))
                          }
                          className="text-lg font-semibold"
                        />
                        <Slider
                          value={[monthlyAmount]}
                          onValueChange={(value) => setMonthlyAmount(value[0])}
                          max={100000}
                          min={500}
                          step={500}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>₹500</span>
                          <span>₹1,00,000</span>
                        </div>
                      </div>
                    </div>

                    {/* Investment Duration */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Investment Duration (Years)
                      </Label>
                      <div className="space-y-2">
                        <Input
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(Number(e.target.value))}
                          className="text-lg font-semibold"
                        />
                        <Slider
                          value={[duration]}
                          onValueChange={(value) => setDuration(value[0])}
                          max={40}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>1 Year</span>
                          <span>40 Years</span>
                        </div>
                      </div>
                    </div>

                    {/* Expected Return */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Expected Annual Return (%)
                      </Label>
                      <div className="space-y-2">
                        <Input
                          type="number"
                          value={expectedReturn}
                          onChange={(e) =>
                            setExpectedReturn(Number(e.target.value))
                          }
                          className="text-lg font-semibold"
                          step="0.1"
                        />
                        <Slider
                          value={[expectedReturn]}
                          onValueChange={(value) => setExpectedReturn(value[0])}
                          max={25}
                          min={1}
                          step={0.5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>1%</span>
                          <span>25%</span>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Options Toggle */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Label className="text-sm font-medium">
                        Advanced Options
                      </Label>
                      <Switch
                        checked={showAdvanced}
                        onCheckedChange={setShowAdvanced}
                      />
                    </div>

                    {/* Advanced Options */}
                    {showAdvanced && (
                      <div className="space-y-4 pt-2 border-t border-gray-100">
                        {/* Step-up SIP */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">
                              Step-up SIP
                            </Label>
                            <Switch
                              checked={stepUpEnabled}
                              onCheckedChange={setStepUpEnabled}
                            />
                          </div>
                          {stepUpEnabled && (
                            <div className="space-y-2">
                              <Label className="text-xs text-gray-600">
                                Annual Increase (%)
                              </Label>
                              <Input
                                type="number"
                                value={stepUpPercentage}
                                onChange={(e) =>
                                  setStepUpPercentage(Number(e.target.value))
                                }
                                className="text-sm"
                              />
                            </div>
                          )}
                        </div>

                        {/* Lump Sum */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Initial Lump Sum
                          </Label>
                          <Input
                            type="number"
                            value={lumpSumAmount}
                            onChange={(e) =>
                              setLumpSumAmount(Number(e.target.value))
                            }
                            placeholder="Optional"
                          />
                        </div>

                        {/* Inflation Rate */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Inflation Rate (%)
                          </Label>
                          <Input
                            type="number"
                            value={inflationRate}
                            onChange={(e) =>
                              setInflationRate(Number(e.target.value))
                            }
                            step="0.1"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Results Panel */}
              <div className="lg:col-span-2 space-y-6">
                {/* Key Results */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          Maturity Amount
                        </h3>
                        <TrendingUp className="h-6 w-6 opacity-80" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-3xl font-bold">
                          {formatCurrency(calculateSIP.maturityAmount)}
                        </p>
                        <p className="text-blue-100 text-sm">
                          After {duration} years of investment
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg border-0 bg-gradient-to-br from-green-600 to-green-700 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Total Gains</h3>
                        <ArrowUp className="h-6 w-6 opacity-80" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-3xl font-bold">
                          {formatCurrency(calculateSIP.totalGains)}
                        </p>
                        <p className="text-green-100 text-sm">
                          {(
                            (calculateSIP.totalGains /
                              calculateSIP.totalInvestment) *
                            100
                          ).toFixed(1)}
                          % returns
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Investment Summary */}
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieIcon className="h-5 w-5 text-purple-600" />
                      Investment Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">
                            Monthly Investment
                          </span>
                          <span className="font-semibold">
                            {formatCurrency(monthlyAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">
                            Total Investment
                          </span>
                          <span className="font-semibold">
                            {formatCurrency(calculateSIP.totalInvestment)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">
                            Investment Period
                          </span>
                          <span className="font-semibold">
                            {duration} years
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <div id="pie-chart">
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value) =>
                                  formatCurrency(Number(value))
                                }
                              />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="flex justify-center gap-4 mt-2">
                            {pieData.map((entry, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-xs text-gray-600">
                                  {entry.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Growth Chart */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle>Investment Growth Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div id="growth-chart">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis
                        tickFormatter={(value) =>
                          `₹${(value / 100000).toFixed(1)}L`
                        }
                      />
                      <Tooltip
                        formatter={(value) => formatCurrency(Number(value))}
                      />
                      <Line
                        type="monotone"
                        dataKey="invested"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Total Invested"
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Portfolio Value"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Yearly Breakdown Table */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle>Year-wise Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-80 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-gray-50">
                        <tr>
                          <th className="text-left p-2">Year</th>
                          <th className="text-right p-2">Invested</th>
                          <th className="text-right p-2">Value</th>
                          <th className="text-right p-2">Gains</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calculateSIP.yearlyBreakdown.map((row) => (
                          <tr key={row.year} className="border-t">
                            <td className="p-2 font-medium">{row.year}</td>
                            <td className="p-2 text-right">
                              {formatCurrency(row.invested)}
                            </td>
                            <td className="p-2 text-right font-semibold">
                              {formatCurrency(row.value)}
                            </td>
                            <td className="p-2 text-right text-green-600 font-semibold">
                              {formatCurrency(row.gains)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {(
                    (calculateSIP.maturityAmount /
                      calculateSIP.totalInvestment -
                      1) *
                    100
                  ).toFixed(1)}
                  %
                </div>
                <div className="text-sm text-gray-600">Total Returns</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-green-600">
                  {expectedReturn}%
                </div>
                <div className="text-sm text-gray-600">Annual Returns</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {formatNumber(duration * 12)}
                </div>
                <div className="text-sm text-gray-600">Total Installments</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {(
                    calculateSIP.maturityAmount /
                    (inflationRate > 0
                      ? Math.pow(1 + inflationRate / 100, duration)
                      : 1) /
                    100000
                  ).toFixed(1)}
                  L
                </div>
                <div className="text-sm text-gray-600">Real Value (Today)</div>
              </Card>
            </div>
          </TabsContent>

          {/* Goal Planning Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-red-600" />
                    Goal Planning
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Target Amount</Label>
                    <Input
                      type="number"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(Number(e.target.value))}
                      className="text-lg font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Current Age</Label>
                      <Input
                        type="number"
                        value={currentAge}
                        onChange={(e) => setCurrentAge(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Target Age</Label>
                      <Input
                        type="number"
                        value={retirementAge}
                        onChange={(e) =>
                          setRetirementAge(Number(e.target.value))
                        }
                      />
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Required Monthly SIP</span>
                      <span className="text-lg font-bold text-blue-600">
                        {formatCurrency(goalPlanning.requiredSIP)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Current Monthly SIP</span>
                      <span className="text-lg font-bold">
                        {formatCurrency(monthlyAmount)}
                      </span>
                    </div>

                    {goalPlanning.shortfall > 0 && (
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="font-medium">Monthly Shortfall</span>
                        <span className="text-lg font-bold text-red-600">
                          {formatCurrency(goalPlanning.shortfall)}
                        </span>
                      </div>
                    )}

                    {goalPlanning.shortfall === 0 && (
                      <div className="p-3 bg-green-50 rounded-lg text-center">
                        <span className="text-green-600 font-semibold">
                          🎉 You're on track to achieve your goal!
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle>Goal Achievement Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-gray-800 mb-2">
                        {formatCurrency(targetAmount)}
                      </div>
                      <div className="text-gray-600">Target Amount</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">
                          {retirementAge - currentAge} years
                        </div>
                        <div className="text-sm text-gray-600">
                          Time Available
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">
                          {expectedReturn}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Expected Return
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Goal Progress</span>
                        <span>
                          {Math.min(
                            100,
                            (monthlyAmount / goalPlanning.requiredSIP) * 100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              100,
                              (monthlyAmount / goalPlanning.requiredSIP) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Scenarios Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Return Rate Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { rate: 8, label: "Conservative", color: "blue" },
                    { rate: 12, label: "Moderate", color: "green" },
                    { rate: 15, label: "Aggressive", color: "purple" },
                  ].map((scenario) => {
                    const monthlyRate = scenario.rate / 100 / 12;
                    const totalMonths = duration * 12;
                    const maturityAmount =
                      monthlyAmount *
                      ((Math.pow(1 + monthlyRate, totalMonths) - 1) /
                        monthlyRate) *
                      (1 + monthlyRate);
                    const totalInvestment = monthlyAmount * totalMonths;
                    const gains = maturityAmount - totalInvestment;

                    return (
                      <Card
                        key={scenario.rate}
                        className={`border-2 border-${scenario.color}-200`}
                      >
                        <CardContent className="p-4">
                          <div className="text-center space-y-3">
                            <Badge
                              variant="outline"
                              className={`text-${scenario.color}-600`}
                            >
                              {scenario.label} - {scenario.rate}%
                            </Badge>
                            <div>
                              <div className="text-2xl font-bold">
                                {formatCurrency(maturityAmount)}
                              </div>
                              <div className="text-sm text-gray-600">
                                Maturity Amount
                              </div>
                            </div>
                            <div>
                              <div
                                className={`text-lg font-semibold text-${scenario.color}-600`}
                              >
                                {formatCurrency(gains)}
                              </div>
                              <div className="text-sm text-gray-600">
                                Total Gains
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Export Options */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">Export Your Analysis</h3>
                <p className="text-gray-600 text-sm">
                  Download detailed reports and share your investment plan
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setShowClientDialog(true);
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" className="flex items-center gap-2" disabled>
                  <Download className="h-4 w-4" />
                  Export Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Info Dialog */}
      <ClientInfoDialog
        open={showClientDialog}
        onClose={() => setShowClientDialog(false)}
        onSave={async (clientInfo: ClientInfo) => {
          setShowClientDialog(false);
          const advisorInfo = getAdvisorInfo();
          await generatePDFWithReact(
            {
              monthlyInvestment: calculateSIP.monthlyInvestment,
              totalInvestment: calculateSIP.totalInvestment,
              maturityAmount: calculateSIP.maturityAmount,
              totalGains: calculateSIP.totalGains,
              duration,
              expectedReturn,
              yearlyBreakdown: calculateSIP.yearlyBreakdown,
            },
            {
              ...goalPlanning,
              currentAge,
              retirementAge,
            },
            advisorInfo,
            currentAge,
            retirementAge,
            clientInfo
          );
        }}
      />
    </div>
  );
};

export default SIPCalculator;
