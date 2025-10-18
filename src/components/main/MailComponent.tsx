"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, ChevronDown, Trash2 } from "lucide-react";
import { useGetMailQuery, useDeleteMailMutation } from "@/backend/mail/mail.query";

export const MailDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [expandedMailIds, setExpandedMailIds] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const { data: mails, isLoading } = useGetMailQuery();
  const deleteMailMutation = useDeleteMailMutation();

  const mailList = mails?.data || [];
  const mailCount = mailList.length;

  // Toggle expanded mail
  const toggleExpand = (id: string) => {
    setExpandedMailIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  // Delete mail
  const handleDelete = async (id: string) => {
    try {
      await deleteMailMutation.mutateAsync(id);
    } catch (err) {
      console.error("Failed to delete mail:", err);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative z-50">
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen((p) => !p)}
        whileTap={{ scale: 0.9 }}
        className="relative bg-emerald-400 backdrop-blur-xl border border-emerald-200/50 shadow-md rounded-full flex items-center justify-center p-3 cursor-pointer hover:scale-105 hover:shadow-lg transition-all"
      >
        <Mail className="text-white w-5 h-5" />

        {/* Notification Indicator */}
        <AnimatePresence>
          {mailCount > 0 && !open && (
            <motion.div
              key="mail-indicator"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-[1px] rounded-full shadow-md"
            >
              {mailCount > 9 ? "9+" : mailCount}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dropdown - Desktop */}
      <AnimatePresence>
        {open && (
          <>
            {/* Mobile/Tablet: Full screen overlay */}
            <motion.div
              key="mail-dropdown-mobile"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-x-0 top-0 mx-2 mt-16 sm:mt-20 md:hidden bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-[calc(100vh-5rem)]"
            >
              <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-700">Inbox</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 transition"
                >
                  Close
                </button>
              </div>

              <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="animate-spin w-5 h-5 text-gray-400" />
                  </div>
                ) : mailCount ? (
                  <ul className="divide-y divide-gray-100">
                    {mailList.map((mail: any) => {
                      const isExpanded = expandedMailIds.includes(mail._id);
                      return (
                        <li
                          key={mail._id}
                          className="px-4 py-3 hover:bg-gray-50 transition-colors relative"
                        >
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-gray-800 mb-1 text-sm sm:text-base">
                              You have a mail
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => toggleExpand(mail._id)}
                                className="text-gray-400 hover:text-gray-600 transition"
                              >
                                <ChevronDown
                                  className={`w-4 h-4 transform transition-transform ${
                                    isExpanded ? "rotate-180" : "rotate-0"
                                  }`}
                                />
                              </button>
                              <button
                                onClick={() => handleDelete(mail._id)}
                                className="text-gray-400 hover:text-red-500 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <p className="text-sm text-gray-600 whitespace-pre-line mt-1">
                                  {mail.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(mail.createdAt).toLocaleString()}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Preview text when not expanded */}
                          {!isExpanded && (
                            <p className="text-sm text-gray-500 truncate mt-1">
                              {mail.message.slice(0, 60)}...
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="py-6 text-center text-gray-500">
                    No mails found
                  </div>
                )}
              </div>
            </motion.div>

            {/* Desktop: Dropdown */}
            <motion.div
              key="mail-dropdown-desktop"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="hidden md:block absolute right-0 mt-3 w-80 lg:w-96 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-700">Inbox</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 transition"
                >
                  Close
                </button>
              </div>

              <div className="max-h-64 lg:max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="animate-spin w-5 h-5 text-gray-400" />
                  </div>
                ) : mailCount ? (
                  <ul className="divide-y divide-gray-100">
                    {mailList.map((mail: any) => {
                      const isExpanded = expandedMailIds.includes(mail._id);
                      return (
                        <li
                          key={mail._id}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors relative"
                        >
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-gray-800 mb-1">
                              📨 AI Insight
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => toggleExpand(mail._id)}
                                className="text-gray-400 hover:text-gray-600 transition"
                              >
                                <ChevronDown
                                  className={`w-4 h-4 transform transition-transform ${
                                    isExpanded ? "rotate-180" : "rotate-0"
                                  }`}
                                />
                              </button>
                              <button
                                onClick={() => handleDelete(mail._id)}
                                className="text-gray-400 hover:text-red-500 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <p className="text-sm text-gray-600 whitespace-pre-line mt-1">
                                  {mail.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(mail.createdAt).toLocaleString()}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Preview text when not expanded */}
                          {!isExpanded && (
                            <p className="text-sm text-gray-500 truncate mt-1">
                              {mail.message.slice(0, 60)}...
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="py-6 text-center text-gray-500">
                    No mails found
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};