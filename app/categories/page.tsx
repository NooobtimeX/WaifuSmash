"use client";

import React, { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Check if categories exist in localStorage and are still valid (5 min)
        const storedCategories = localStorage.getItem("categories");
        const storedTimestamp = localStorage.getItem("categoriesTimestamp");
        const now = Date.now();

        if (
          storedCategories &&
          storedTimestamp &&
          now - parseInt(storedTimestamp) < 5 * 60 * 1000
        ) {
          setCategories(JSON.parse(storedCategories));
        } else {
          // Fetch categories from API if not cached or expired
          const response = await fetch("/api/categories");
          if (!response.ok) {
            throw new Error("Failed to load categories");
          }
          const data = await response.json();

          // Store categories and timestamp in localStorage
          localStorage.setItem("categories", JSON.stringify(data));
          localStorage.setItem("categoriesTimestamp", now.toString());

          setCategories(data);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    fetchCategories();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!categories.length) {
    return <div className="text-white">Loading categories...</div>;
  }

  return (
    <div className="min-h-screen p-4 text-white">
      <h1 className="mb-6 text-3xl font-bold">Categories</h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-md"
          >
            <h2 className="text-xl font-bold">{category.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
