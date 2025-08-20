"use client";

import { useGetCategories } from "@/backend/category/category.query";
import { useAddExpense } from "@/backend/expenses/expenses.query";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  Wallet,
  FileText,
  Tag,
  Calendar,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

function Page() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("debited");

  const formatDateTimeLocal = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const [date, setDate] = useState(formatDateTimeLocal(new Date()));
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useGetCategories();
  const addExpenseMutation = useAddExpense();

  const handleSubmit = async () => {
    if (status === "debited") {
      if (!amount || !description || !categoryId) {
        toast.error("Please enter amount, description and category");
        return;
      }
    } else {
      if (!amount || !description) {
        toast.error("Please enter amount and description");
        return;
      }
    }

    await addExpenseMutation.mutateAsync({
      amount: Number(amount),
      categoryId: status === "debited" ? categoryId : undefined,
      description,
      status,
      createdAt: date,
    });

    queryClient.invalidateQueries({ queryKey: ["wallet"] });
    setAmount("");
    setDescription("");
    setCategoryId("");
    setStatus("debited");
    setDate(formatDateTimeLocal(new Date()));
  };

  return (
    <div className="p-4 md:p-6 flex-1 flex justify-center h-full items-center">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-6 space-y-6 border border-gray-100">
        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-600">
            Add Expense
          </h2>
          <p className="text-sm text-gray-500">
            Track your spending & earnings easily
          </p>
        </div>

        {/* Amount */}
        <div className="relative group">
          <Wallet
            className="absolute left-3 top-3 text-emerald-500 group-focus-within:text-emerald-600"
            size={18}
          />
          <input
            type="number"
            placeholder="Amount"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
            text-black focus:outline-none focus:ring-2 focus:ring-emerald-500 
            shadow-sm transition bg-gray-50"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="relative group">
          <FileText
            className="absolute left-3 top-3 text-emerald-500 group-focus-within:text-emerald-600"
            size={18}
          />
          <input
            type="text"
            placeholder="Description"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
            text-black focus:outline-none focus:ring-2 focus:ring-emerald-500 
            shadow-sm transition bg-gray-50"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Status toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setStatus("debited")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
              status === "debited"
                ? "bg-red-100 text-red-600"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <ArrowDownCircle size={18} /> Debit
          </button>
          <button
            type="button"
            onClick={() => {
              setStatus("credited");
              setCategoryId("");
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
              status === "credited"
                ? "bg-emerald-100 text-emerald-600"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <ArrowUpCircle size={18} /> Credit
          </button>
        </div>

        {/* Category */}
        {status === "debited" && (
          <div className="relative group">
            <Tag
              className="absolute left-3 top-3 text-emerald-500 group-focus-within:text-emerald-600"
              size={18}
            />
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
              bg-gray-50 text-emerald-700 focus:outline-none focus:ring-2 
              focus:ring-emerald-500 shadow-sm transition"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={isLoading}
            >
              <option value="">Select Category</option>
              {!isLoading &&
                categories?.data?.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Date */}
        <div
          className="relative group"
          onClick={() =>
            (
              document.getElementById("datetime") as HTMLInputElement
            )?.showPicker?.()
          }
        >
          <Calendar
            className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none group-focus-within:text-emerald-600"
            size={18}
          />
          <input
            id="datetime"
            type="datetime-local"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
            text-black focus:outline-none focus:ring-2 focus:ring-emerald-500 
            shadow-sm transition cursor-pointer bg-gray-50"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={addExpenseMutation.isPending}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 
          hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 
          text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition"
        >
          {addExpenseMutation.isPending ? "Adding..." : "Add Expense"}
        </button>
      </div>
    </div>
  );
}

export default Page;
