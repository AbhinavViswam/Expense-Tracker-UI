import { axiosClient } from "../axiosConfig";
import { IExpense } from "./expenses.types";

const EXPENSE_URL = `/expense`;

export const addExpense = async ({
  amount,
  description,
  categoryId,
  status,
  createdAt
}: IExpense) => {
  return await axiosClient.post(`${EXPENSE_URL}/addexpense`, {
    amount,
    description,
    categoryId,
    status,
    createdAt
  });
};

export const getExpense = async (dateRange: string = "daily") => {
  const res = await axiosClient.get(
    `${EXPENSE_URL}/getexpense?dateRange=${dateRange}`
  );
  return res.data;
};

export const getCreditedExpense = async (dateRange: string = "daily") => {
  const res = await axiosClient.get(
    `${EXPENSE_URL}/getcreditedexpense?dateRange=${dateRange}`
  );
  return res.data;
};
