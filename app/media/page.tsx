"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Game {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  photo: string | null;
}

interface Category {
  id: number;
  name: string;
}

const MediaPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [search, setSearch] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const pageSize = 8; // Define the number of items per page

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      const response = await fetch("/api/categories"); // Assuming you have an endpoint for categories
      const data = await response.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch filtered and paginated games
    const fetchGames = async () => {
      try {
        const params = new URLSearchParams({
          search,
          categories: selectedCategories.join(","),
          page: page.toString(),
        }).toString();

        const response = await fetch(`/api/media?${params}`);
        if (!response.ok) {
          throw new Error("Failed to load games");
        }

        const data = await response.json();
        setGames(data.media);
        setTotalPages(Math.ceil(data.total / pageSize)); // Calculate total pages
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    fetchGames();
  }, [search, selectedCategories, page]);

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for a game..."
          value={search}
          onChange={handleSearchChange}
          className="mb-4 w-full rounded-md bg-gray-700 p-2"
        />
        <div className="mb-4">
          <h3 className="text-lg font-bold">Filter by Category:</h3>
          {categories.map((category) => (
            <label key={category.id} className="block">
              <input
                type="checkbox"
                value={category.id}
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
              />
              {category.name}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {games.map((game) => (
          <Link href={`/media/${game.id}`} key={game.id}>
            <div className="game-item mb-6 cursor-pointer rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-md hover:bg-gray-700">
              <h2 className="mb-4 text-xl font-bold sm:text-2xl">
                {game.name}
              </h2>

              {game.photo && (
                <img
                  src={game.photo}
                  alt={game.name}
                  className="mb-4 h-32 w-full rounded-md object-cover"
                />
              )}

              <p className="text-sm text-gray-400">
                Created: {new Date(game.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-400">
                Updated: {new Date(game.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="rounded-md bg-gray-700 p-2"
        >
          Previous
        </button>
        <span className="text-lg">{page}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="rounded-md bg-gray-700 p-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MediaPage;
