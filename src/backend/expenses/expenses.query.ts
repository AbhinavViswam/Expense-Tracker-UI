"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addExpense, getExpense } from "./expenses.api";
import { IExpense } from "./expenses.types";

export const useGetExpenses = (dateRange: string = "daily") => {
  return useQuery({
    queryKey: ["expenses", dateRange],
    queryFn: () => getExpense(dateRange),
  });
};

export const useAddExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expense: IExpense) => addExpense(expense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
};
