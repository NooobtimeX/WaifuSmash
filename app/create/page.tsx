"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import AppButton from "@/components/AppButton";
import { useRouter } from "next/navigation";
import AvatarEditorModal from "@/components/AvatarEditorModal";

interface Category {
  id: number;
  name: string;
}

const MediaPage: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUserId(data?.user?.id ?? null);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (Array.isArray(data)) {
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0].id);
        }
      } else {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
      setIsModalOpen(true);
    }
  };

  const handleSave = (croppedImage: Blob) => {
    const formData = new FormData();
    formData.append("file", croppedImage, "cropped_image.png");
    formData.append("path", "media");

    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setPhotoUrl(data.url);
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        setIsModalOpen(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!categoryId) {
      setError("Please select a category.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/media/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          photo: photoUrl,
          userId,
          categoryId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add media.");
      }

      setName("");
      setDescription("");
      setPhoto(null);
      setPhotoUrl(null);
      setCategoryId(null);
      router.push("/profile");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-4xl rounded-lg p-6 shadow-lg">
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm"
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label className="block">Photo (Supported: .jpg, .jpeg, .png)</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={handlePhotoChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block">Category</label>
          <select
            value={categoryId || ""}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <AppButton type="submit" variant="create" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Create"}
          </AppButton>
        </div>
      </form>

      <AvatarEditorModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        photo={photo}
        onSave={handleSave}
      />
    </div>
  );
};

export default MediaPage;
