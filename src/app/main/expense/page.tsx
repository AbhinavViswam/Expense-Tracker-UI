"use client";

import { useGetCategories } from "@/backend/category/category.query";
import { useAddExpense } from "@/backend/expenses/expenses.query";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

function Page() {
  const [amount, setAmount] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useGetCategories();
  const addExpenseMutation = useAddExpense();

  const handleSubmit = async () => {
    if (!amount || !description || !categoryId) {
      toast.error("Please enter amount and description");
      return;
    }
    await addExpenseMutation.mutate({
      amount: Number(amount),
      description,
      categoryId,
    });
    queryClient.invalidateQueries({ queryKey: ["wallet"] });
  };

  return (
    <div className="flex flex-col p-4 gap-4 max-w-md mx-auto bg-white shadow-lg rounded-xl">
      <input
        type="number"
        placeholder="Amount"
        className="w-full px-4 py-2 border border-emerald-500 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value ? Number(e.target.value) : "")
        }
      />
      <input
        type="text"
        placeholder="Description"
        className="w-full px-4 py-2 border border-emerald-500 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        className="w-full px-4 py-2 border border-emerald-500 rounded-lg bg-white text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
      <button
        onClick={handleSubmit}
        disabled={addExpenseMutation.isPending}
        className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold rounded-lg transition"
      >
        {addExpenseMutation.isPending ? "Adding..." : "Add Expense"}
      </button>
    </div>
  );
}

export default Page;
