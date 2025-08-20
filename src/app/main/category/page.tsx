"use client";

import {
  useAddCategory,
  useDeleteCategory,
  useEditCategory,
  useGetCategories,
} from "@/backend/category/category.query";
import React, { useState } from "react";
import { Check, X, PlusCircle, Folder, Edit2, Trash2 } from "lucide-react";

export default function Page() {
  const [categoryName, setCategoryName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const { data: categories, isLoading } = useGetCategories();
  const addCategoryMutation = useAddCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const editCategoryMutation = useEditCategory();

  const handleAddCategory = async () => {
    if (!categoryName.trim()) return;
    await addCategoryMutation.mutateAsync({ categoryName });
    setCategoryName("");
  };

  const handleDeleteCategory = async (catId: string) => {
    await deleteCategoryMutation.mutateAsync({ catId });
  };

  const handleEditCategory = async (catId: string) => {
    if (!editingName.trim()) return;
    await editCategoryMutation.mutateAsync({
      catId,
      categoryName: editingName,
    });
    setEditingId(null);
    setEditingName("");
  };

  if (isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <span className="loading loading-ring loading-xl text-emerald-600"></span>
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-emerald-600">Categories</h1>
          <p className="text-gray-500 mt-1">
            Manage and organize your expense categories easily.
          </p>
        </div>

        {/* Add Category */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="input input-bordered input-success w-full bg-white text-emerald-700 pr-10"
            />
            {categoryName && (
              <X
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={() => setCategoryName("")}
              />
            )}
          </div>
          <button
            onClick={handleAddCategory}
            className="btn btn-success flex items-center gap-2 px-5"
          >
            <PlusCircle size={18} />
            Add
          </button>
        </div>

        {/* Categories List */}
        {categories?.data && categories?.data.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
            {categories.data.map((cat: any) => (
              <div
                key={cat._id}
                className={`card bg-white/80 backdrop-blur shadow-md border transition-all hover:shadow-lg hover:-translate-y-1 ${
                  editingId === cat._id
                    ? "border-emerald-500 ring-2 ring-emerald-200"
                    : "border-gray-200"
                }`}
              >
                <div className="card-body p-4">
                  {editingId === cat._id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="input input-bordered input-success w-full bg-white text-emerald-700"
                    />
                  ) : (
                    <h2 className="card-title text-emerald-700 break-words flex items-center gap-2">
                      <Folder size={18} className="text-emerald-500" />
                      {cat.categoryName}
                    </h2>
                  )}

                  <div className="card-actions justify-end mt-4 flex-wrap gap-2">
                    {editingId === cat._id ? (
                      <>
                        <button
                          onClick={() => handleEditCategory(cat._id)}
                          className="btn btn-success btn-sm flex items-center gap-1"
                        >
                          <Check size={16} /> Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="btn btn-ghost btn-sm flex items-center gap-1"
                        >
                          <X size={16} /> Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(cat._id);
                            setEditingName(cat.categoryName);
                          }}
                          className="btn btn-ghost btn-sm text-emerald-600 border border-emerald-600 hover:bg-emerald-50 flex items-center gap-1"
                        >
                          <Edit2 size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="btn btn-error btn-sm flex items-center gap-1"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-16">
            <Folder size={40} className="mx-auto text-gray-300 mb-3" />
            <p>No categories available. Add your first one above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
