import { useQuery } from "@tanstack/react-query";
import { getWallet, getWalletTrace } from "./wallet.api";

export function useGetWalletTrace() {
  return useQuery({
    queryKey: ["wallettrace"],
    queryFn: getWalletTrace,
  });
}

export function useGetWallet() {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: getWallet,
  });
}
