import { axiosClient } from "../axiosConfig";
import { IAddCategory, IDeleteCategory, IEditCategory } from "./category.types";

const CATEGORY_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/category`;

export const addCategory = async ({ categoryName }: IAddCategory) => {
  return await axiosClient.post(`${CATEGORY_URL}`, {
    categoryName,
  });
};

export const getCategories = async () => {
  const res = await axiosClient.get(`${CATEGORY_URL}`);
  return res.data;
};

export const deleteCategories = async ({ catId }: IDeleteCategory) => {
  return await axiosClient.delete(`${CATEGORY_URL}/${catId}`);
};

export const editCategories = async ({
  catId,
  categoryName,
}: IEditCategory) => {
  return await axiosClient.put(`${CATEGORY_URL}/${catId}`, {
    categoryName,
  });
};
