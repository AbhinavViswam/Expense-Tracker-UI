import { useMutation } from "@tanstack/react-query";
import { login, signup } from "./user.api";
import { ILogin, ISignup } from "./user.types";

export function useLogin() {
  return useMutation({
    mutationFn: (data: ILogin) => login(data),
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: (data: ISignup) => signup(data),
  });
}
