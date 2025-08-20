"use client";
import { addToWallet, subFromWallet } from "@/backend/wallet/wallet.api";
import { useGetWallet, useGetWalletTrace } from "@/backend/wallet/wallet.query";
import { useQueryClient } from "@tanstack/react-query";
import { IndianRupee, Notebook, Wallet } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";

function Page() {
  const [amount, setAmount] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isRefetching } = useGetWalletTrace();
  const {
    data: walletData,
    isLoading: walletIsLoading,
    isRefetching: walletIsReFetching,
    isError: walletIsError,
  } = useGetWallet();

  const handleAction = async (type: "add" | "sub") => {
    if (!amount || !description) {
      toast.error("Please enter amount and description");
      return;
    }

    setLoading(true);
    try {
      if (type === "add") {
        await addToWallet({ amount: Number(amount), description });
        toast.success("Amount added successfully!");
      } else {
        await subFromWallet({ amount: Number(amount), description });
        toast.success("Amount deducted successfully!");
      }
      queryClient.invalidateQueries({ queryKey: ["wallettrace"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      setAmount("");
      setDescription("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Transaction failed", {
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  // format date with dayjs
  const formatDate = (dateStr: string) => {
    const d = dayjs(dateStr);
    const now = dayjs();

    if (d.isSame(now, "day")) {
      return d.format("hh:mm A"); // today
    }
    if (d.isSame(now.subtract(1, "day"), "day")) {
      return `Yesterday ${d.format("hh:mm A")}`;
    }
    return d.format("DD MMM YYYY, hh:mm A"); // older
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-6 md:p-10">
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-3xl p-8 mb-10 shadow-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-2xl">
            <Wallet className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-lg font-medium opacity-90">Wallet Balance</h2>
            {walletIsLoading || walletIsReFetching ? (
              <span className="loading loading-bars loading-lg bg-white"></span>
            ) : walletIsError ? (
              <p className="text-red-200">Failed to load balance</p>
            ) : (
              <p className="text-4xl font-bold tracking-wide">
                ₹{walletData?.data?.amount.toLocaleString("en-IN")}
              </p>
            )}
          </div>
        </div>
        {walletData?.data?.updatedAt && (
          <p className="mt-6 sm:mt-0 text-sm text-emerald-100">
            Last updated: {formatDate(walletData.data.updatedAt)}
          </p>
        )}
      </div>

      <h1 className="text-3xl font-extrabold text-emerald-700 mb-6 text-center">
        Wallet Management
      </h1>

      {/* Input Section */}
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 flex flex-col gap-4 sm:flex-row mb-8 border border-emerald-100">
        <div className="flex gap-2 items-center w-full border border-emerald-300 rounded-xl px-3 py-2 bg-emerald-50/30">
          <IndianRupee className="text-emerald-600" />
          <input
            type="number"
            placeholder="Amount"
            className="w-full bg-transparent focus:outline-none text-black placeholder:text-gray-400"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value ? Number(e.target.value) : "")
            }
          />
        </div>
        <div className="flex gap-2 items-center w-full border border-emerald-300 rounded-xl px-3 py-2 bg-emerald-50/30">
          <Notebook className="text-emerald-600" />
          <input
            type="text"
            placeholder="Description"
            className="w-full bg-transparent focus:outline-none text-black placeholder:text-gray-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-6 justify-center mb-10">
        <button
          className={`flex-1 max-w-xs py-3 rounded-xl font-semibold text-lg shadow-lg transition transform hover:scale-[1.02] ${
            loading
              ? "loading"
              : "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:opacity-90"
          }`}
          onClick={() => handleAction("add")}
          disabled={loading}
        >
          Add Money
        </button>
        <button
          className={`flex-1 max-w-xs py-3 rounded-xl font-semibold text-lg shadow-lg transition transform hover:scale-[1.02] ${
            loading
              ? "loading"
              : "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:opacity-90"
          }`}
          onClick={() => handleAction("sub")}
          disabled={loading}
        >
          Subtract
        </button>
      </div>

      {/* Wallet History */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
          Wallet History
        </h2>

        {isLoading || isRefetching ? (
          <div className="flex justify-center items-center py-8">
            <span className="loading loading-bars loading-xl bg-emerald-600"></span>
          </div>
        ) : isError ? (
          <p className="text-red-500 text-center">Failed to load history.</p>
        ) : data?.data?.length === 0 ? (
          <p className="text-gray-500 text-center">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-emerald-600 text-white rounded-lg">
                  <th className="rounded-l-lg px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="rounded-r-lg px-4 py-3 text-left">
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((tx: any, i: number) => (
                  <tr
                    key={tx._id}
                    className="bg-emerald-50 hover:bg-emerald-100 transition rounded-lg shadow-sm"
                  >
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3">{tx.description}</td>
                    <td className="px-4 py-3 font-semibold">
                      ₹{tx.amount.toLocaleString("en-IN")}
                    </td>
                    <td
                      className={`px-4 py-3 font-bold ${
                        tx.status === "credited"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {tx.status}
                    </td>
                    <td className="px-4 py-3">{formatDate(tx.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Page;
