import { axiosClient } from "../axiosConfig";
import { ILogin, ISignup } from "./user.types";

const USER_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/user`;

export const login = async ({ email, password }: ILogin) => {
  return await axiosClient.post(`${USER_URL}/login`, {
    email,
    password,
  });
};

export const signup = async ({ name, phone, email, password }: ISignup) => {
  return await axiosClient.post(`${USER_URL}/signup`, {
    name,
    phone,
    email,
    password,
  });
};

export const logout = async () => {
  return await axiosClient.post(`${USER_URL}/logout`);
};
