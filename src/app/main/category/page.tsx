"use client";

import {
  useAddCategory,
  useDeleteCategory,
  useEditCategory,
  useGetCategories,
} from "@/backend/category/category.query";
import React, { useState } from "react";

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
        <span className="loading loading-ring loading-xl bg-emerald-600"></span>
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-white p-4 sm:p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-6">
          Categories
        </h1>

        {/* Add Category */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            className="input input-bordered input-success w-full sm:flex-1 bg-white text-emerald-600"
          />
          <button
            onClick={handleAddCategory}
            className="btn btn-success w-full sm:w-auto"
          >
            Add
          </button>
        </div>

        {/* Categories List */}
        {categories?.data && categories?.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.data.map((cat: any) => (
              <div
                key={cat._id}
                className="card bg-white shadow-lg border border-emerald-600 w-full"
              >
                <div className="card-body">
                  {editingId === cat._id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="input input-bordered input-success w-full bg-white text-emerald-600"
                    />
                  ) : (
                    <h2 className="card-title text-emerald-600 break-words">
                      {cat.categoryName}
                    </h2>
                  )}
                  <div className="card-actions justify-end mt-4 flex-wrap gap-2">
                    {editingId === cat._id ? (
                      <>
                        <button
                          onClick={() => handleEditCategory(cat._id)}
                          className="btn btn-success btn-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="btn btn-ghost btn-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(cat._id);
                            setEditingName(cat.categoryName);
                          }}
                          className="btn btn-ghost btn-sm text-emerald-600 border border-emerald-600 hover:bg-emerald-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="btn btn-error btn-sm"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            No categories available.
          </div>
        )}
      </div>
    </div>
  );
}
