import { axiosClient } from "../axiosConfig";
import { IExpense } from "./expenses.types";

const EXPENSE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/expense`;

export const addExpense = async ({
  amount,
  description,
  categoryId,
}: IExpense) => {
  return await axiosClient.post(`${EXPENSE_URL}/addexpense`, {
    amount,
    description,
    categoryId,
  });
};

export const getExpense = async (dateRange: string = "daily") => {
  const res = await axiosClient.get(
    `${EXPENSE_URL}/getexpense?dateRange=${dateRange}`
  );
  return res.data;
};
