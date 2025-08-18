"use client";

import { useGetExpenses } from "@/backend/expenses/expenses.query";
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
} from "recharts";

export default function Page() {
  const [dateRange, setDateRange] = useState("daily");
  const { data, isLoading } = useGetExpenses(dateRange);

  if (isLoading) {
    return <div className="p-6 text-center text-emerald-600">Loading...</div>;
  }

  // transform backend response
  const expenses = data?.data || [];

  // colors for pie chart slices
  const generateColors = (count: number) => {
  const hue = 160; // emerald green hue
  const saturation = 65; // keep it consistent
  const minLightness = 30; // darker emerald
  const maxLightness = 65; // lighter emerald

  return Array.from({ length: count }, (_, i) => {
    const lightness =
      minLightness + ((maxLightness - minLightness) * i) / (count - 1 || 1);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  });
};

  const COLORS = generateColors(expenses.length);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl text-black space-y-8">
      {/* Date Range Selector */}
      <select
        className="mb-6 w-full px-4 py-2 border border-emerald-500 rounded-lg bg-white text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        value={dateRange}
        onChange={(e) => setDateRange(e.target.value)}
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>

      {/* Bar Chart */}
      <div className="w-full h-80">
        <ResponsiveContainer>
          <BarChart data={expenses}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="categoryName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalAmount" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="w-full h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={expenses}
              dataKey="totalAmount"
              nameKey="categoryName"
              cx="50%"
              cy="50%"
              outerRadius={120}
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
    </div>
  );
}
