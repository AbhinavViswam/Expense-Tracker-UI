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
    <section className="min-h-screen bg-white p-4 sm:p-6 md:p-8">
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl p-6 mb-8 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Wallet className="w-10 h-10" />
          <div>
            <h2 className="text-lg font-semibold">Wallet Balance</h2>
            {walletIsLoading || walletIsReFetching ? (
             <span className="loading loading-bars loading-xl bg-emerald-600"></span>
            ) : walletIsError ? (
              <p className="text-red-200">Failed to load balance</p>
            ) : (
              <p className="text-3xl font-bold">
                ₹{walletData?.data?.amount.toLocaleString("en-IN")}
              </p>
            )}
          </div>
        </div>
        {walletData?.data?.updatedAt && (
          <p className="mt-4 sm:mt-0 text-sm text-emerald-100">
            Last updated: {formatDate(walletData.data.updatedAt)}
          </p>
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-6">
        Wallet Management
      </h1>

      {/* Input Section */}
      <div className="w-full gap-3 bg-primary py-6 flex flex-col sm:flex-row items-center justify-center rounded-lg mb-4">
        <div className="flex gap-1 items-center w-full border border-emerald-600 rounded-md p-1">
          <IndianRupee className="text-emerald-700" />
          <input
            type="number"
            placeholder="Amount"
            className="input w-full text-black bg-white"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value ? Number(e.target.value) : "")
            }
          />
        </div>
        <div className="flex gap-1 items-center w-full border border-emerald-600 rounded-md p-1">
          <Notebook className="text-emerald-700" />
          <input
            type="text"
            placeholder="Description"
            className="input w-full text-black bg-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center items-center mb-8">
        <button
          className={`btn flex-1 bg-secondary text-white border-none hover:bg-secondary-focus ${
            loading ? "loading" : ""
          }`}
          onClick={() => handleAction("add")}
          disabled={loading}
        >
          Add
        </button>
        <button
          className={`btn flex-1 bg-red-500 text-white border-none hover:bg-red-600 ${
            loading ? "loading" : ""
          }`}
          onClick={() => handleAction("sub")}
          disabled={loading}
        >
          Subtract
        </button>
      </div>

      {/* Wallet Trace */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-secondary mb-4">
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
            <table className="table w-full border rounded-lg">
              <thead className="bg-secondary text-white">
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((tx: any, i: number) => (
                  <tr key={tx._id}>
                    <td>{i + 1}</td>
                    <td>{tx.description}</td>
                    <td>₹{tx.amount.toLocaleString("en-IN")}</td>
                    <td
                      className={
                        tx.status === "credited"
                          ? "text-emerald-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {tx.status}
                    </td>
                    <td>{formatDate(tx.createdAt)}</td>
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
