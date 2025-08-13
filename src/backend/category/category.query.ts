import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IAddCategory, IDeleteCategory, IEditCategory } from "./category.types";
import {
  addCategory,
  deleteCategories,
  editCategories,
  getCategories,
} from "./category.api";

export function useAddCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IAddCategory) => addCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useGetCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IDeleteCategory) => deleteCategories(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useEditCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IEditCategory) => editCategories(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
