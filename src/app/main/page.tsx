"use client";

import {
  useGetCreditedExpenses,
  useGetExpenses,
} from "@/backend/expenses/expenses.query";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import dayjs from "dayjs";
import { PiggyBank, TrendingUp, Wallet } from "lucide-react";

export default function Page() {
  const [dateRange, setDateRange] = useState("daily");
  const { data, isLoading } = useGetExpenses(dateRange);
  const { data: creditData, isLoading: creditLoading } =
    useGetCreditedExpenses(dateRange);

  if (isLoading || creditLoading) {
    return <div className="p-6 text-center text-emerald-600">Loading...</div>;
  }

  const expenses = data?.data || [];
  const creditedExpenses =
    creditData?.data?.filter((exp: any) => exp.status === "credited") || [];
  const debitedExpenses =
    creditData?.data?.filter((exp: any) => exp.status === "debited") || [];

  // Line chart data
  const lineData = creditedExpenses.map((exp: any) => ({
    date:
      dateRange === "daily"
        ? dayjs(exp.createdAt).format("HH:mm")
        : dateRange === "monthly"
        ? dayjs(exp.createdAt).format("DD MMM")
        : dayjs(exp.createdAt).format("MMM YYYY"),
    amount: exp.amount,
  }));

  // Emerald palette generator
  const generateColors = (count: number) => {
    const hue = 160; // emerald
    const saturation = 65;
    const minLightness = 35;
    const maxLightness = 70;
    return Array.from({ length: count }, (_, i) => {
      const lightness =
        minLightness + ((maxLightness - minLightness) * i) / (count - 1 || 1);
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    });
  };
  const COLORS = generateColors(expenses.length);

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 bg-white rounded-xl text-emerald-700 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900">
            Expense Dashboard
          </h1>
          <p className="text-sm text-emerald-600">
            Track your spending & monitor financial flow
          </p>
        </div>
        {/* Date Range Selector */}
        <div className="relative inline-flex items-center bg-white border border-emerald-300 rounded-full shadow-md px-4 py-2">
          <label
            htmlFor="dateRange"
            className="text-emerald-600 font-medium mr-2 text-sm sm:text-base"
          >
            View:
          </label>
          <select
            id="dateRange"
            className="appearance-none bg-transparent focus:outline-none text-emerald-700 font-semibold cursor-pointer text-sm sm:text-base"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <svg
            className="w-4 h-4 ml-2 text-emerald-600 pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {expenses.map((exp: any, idx: number) => (
          <div
            key={exp.categoryName}
            className="p-6 rounded-2xl shadow-md bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-emerald-800">
                  {exp.categoryName}
                </h3>
                <p className="text-2xl font-bold text-emerald-900 mt-1">
                  ₹{exp.totalAmount}
                </p>
              </div>
              <div className="p-3 rounded-full bg-emerald-100 text-emerald-700">
                {idx % 2 === 0 ? (
                  <Wallet size={22} />
                ) : idx % 3 === 0 ? (
                  <PiggyBank size={22} />
                ) : (
                  <TrendingUp size={22} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] card bg-white shadow-md p-4 border border-emerald-100">
        <h2 className="text-base sm:text-lg font-semibold mb-2 text-emerald-700">
          Category-wise Expenses
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={expenses}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
            <XAxis dataKey="categoryName" stroke="#065f46" />
            <YAxis stroke="#065f46" />
            <Tooltip />
            <Bar dataKey="totalAmount" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] card bg-white shadow-md p-4 border border-emerald-100">
        <h2 className="text-base sm:text-lg font-semibold mb-2 text-emerald-700">
          Expense Distribution
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenses}
              dataKey="totalAmount"
              nameKey="categoryName"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              label
            >
              {expenses.map((_: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] card bg-white shadow-md p-4 border border-emerald-100">
        <h2 className="text-base sm:text-lg font-semibold mb-4 text-emerald-700">
          Credited Trend
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
            <XAxis dataKey="date" stroke="#065f46" />
            <YAxis stroke="#065f46" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 5, fill: "#10b981" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Credited Table */}
        <div className="card bg-white shadow-md border border-emerald-100">
          <div className="card-body">
            <h2 className="card-title text-emerald-700 text-base sm:text-lg">
              Credited Expenses
            </h2>
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="table text-sm sm:text-base">
                <thead>
                  <tr className="bg-emerald-100 text-emerald-900">
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {creditedExpenses.map((exp: any) => (
                    <tr key={exp._id} className="hover:bg-emerald-50">
                      <td className="break-words">{exp.description}</td>
                      <td>₹{exp.amount}</td>
                      <td>
                        {dayjs(exp.createdAt).format("DD MMM YYYY HH:mm")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Debited Table */}
        <div className="card bg-white shadow-md border border-emerald-100">
          <div className="card-body">
            <h2 className="card-title text-emerald-800 text-base sm:text-lg">
              Debited Expenses
            </h2>
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="table text-sm sm:text-base">
                <thead>
                  <tr className="bg-emerald-200 text-emerald-900">
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {debitedExpenses.map((exp: any) => (
                    <tr key={exp._id} className="hover:bg-emerald-50">
                      <td className="break-words">{exp.description}</td>
                      <td>₹{exp.amount}</td>
                      <td>
                        {dayjs(exp.createdAt).format("DD MMM YYYY HH:mm")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
