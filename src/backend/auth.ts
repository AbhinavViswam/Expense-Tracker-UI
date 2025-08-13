import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "./axiosConfig";

const AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/user`;

const getMe = async () => {
  const res = await axiosClient.get(`${AUTH_URL}/checkauth`, {
    withCredentials: true,
  });
  return res.data;
};

export const useAuth = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: getMe,
    retry: false,
  });
};
