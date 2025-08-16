import { axiosClient } from "../axiosConfig";
import { IAddSubWallet } from "./wallet.types";

const WALLET_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/wallet`;

export const addToWallet = async ({ amount, description }: IAddSubWallet) => {
  return await axiosClient.post(`${WALLET_URL}/addtowallet`, {
    amount,
    description,
  });
};

export const subFromWallet = async ({ amount, description }: IAddSubWallet) => {
  return await axiosClient.post(`${WALLET_URL}/subfromwallet`, {
    amount,
    description,
  });
};

export const getWalletTrace = async () => {
  const res = await axiosClient.get(`${WALLET_URL}/wallettrace`);
  return res.data;
};

export const getWallet = async () => {
  const res = await axiosClient.get(`${WALLET_URL}/wallet`);
  return res.data;
};
