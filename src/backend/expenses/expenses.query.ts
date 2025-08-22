"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addExpense, getCreditedExpense, getExpense } from "./expenses.api";
import { IExpense } from "./expenses.types";
import toast from "react-hot-toast";

export const useGetExpenses = (dateRange: string = "monthly") => {
  return useQuery({
    queryKey: ["expenses", dateRange],
    queryFn: () => getExpense(dateRange),
  });
};

export const useGetCreditedExpenses = (dateRange: string = "monthly") => {
  return useQuery({
    queryKey: ["creditedexpenses", dateRange],
    queryFn: () => getCreditedExpense(dateRange),
  });
};

export const useAddExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (expense: IExpense) => addExpense(expense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["creditedexpenses"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("Added Successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "expense not added");
    },
  });
};
