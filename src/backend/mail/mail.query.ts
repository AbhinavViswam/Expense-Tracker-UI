import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteMail, getMail } from "./mail.api";

export const useGetMailQuery = () =>
  useQuery({
    queryKey: ["mail"],
    queryFn: getMail,
  });

export const useDeleteMailMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mail"] });
    },
  });
};