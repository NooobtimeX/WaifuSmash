"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";
import AddCharacterModal from "@/components/AddCharacterModal";

interface Character {
  id: number;
  name: string;
  photo?: string;
}

export default function MediaPage({ params }: { params: { mediaId: string } }) {
  const { mediaId } = params; // Get mediaId from URL params
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // New state to check if mounted

  // Set isMounted to true when the component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch characters on page load
  useEffect(() => {
    if (mediaId) {
      const fetchCharacters = async () => {
        try {
          const res = await fetch(`/api/media/${mediaId}/characters`);
          if (!res.ok) throw new Error("Failed to fetch characters.");
          const data = await res.json();
          setCharacters(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchCharacters();
    }
  }, [mediaId]);

  const handleSubmit = async (name: string, photo: File | null) => {
    setIsSubmitting(true);
    setError("");

    if (!name) {
      setError("Name is required.");
      setIsSubmitting(false);
      return;
    }

    let photoUrl = null;

    // Step 1: Upload the photo to Supabase if a photo is selected
    if (photo) {
      const formData = new FormData();
      formData.append("file", photo);
      formData.append("path", "characters"); // Use 'characters' path for the storage

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Failed to upload photo.");

        const { url } = await res.json();
        photoUrl = url; // Save the photo URL
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unknown error occurred.",
        );
        setIsSubmitting(false);
        return;
      }
    }

    // Step 2: Send the character creation request with the photo URL
    try {
      const characterData = {
        name,
        photo: photoUrl || "", // Ensure photo is an empty string if not provided
        mediaId: mediaId, // Ensure the mediaId is passed
      };

      const res = await fetch(`/api/media/${mediaId}/characters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(characterData),
      });

      if (!res.ok) throw new Error("Failed to create character.");

      const newCharacter = await res.json();
      setCharacters((prev) => [...prev, newCharacter]);

      // Reset form and close modal
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  async function deleteCharacter(characterId: number) {
    try {
      const response = await fetch(`/api/characters/${characterId}/delete`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete character");
      }

      alert("Character deleted successfully!");
      // Optionally, refetch the character list or update the UI to reflect the deletion
    } catch (error) {
      console.error("Error deleting character:", error);
      alert("Error deleting character");
    }
  }

  // Prevent server-side mismatch by waiting for client-side rendering
  if (!isMounted) return null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">
        Characters for Media ID: {mediaId}
      </h1>

      {/* Button to open modal */}
      <Button onClick={() => setIsModalOpen(true)}>Add Character</Button>
      {/* Character List */}
      <div className="mt-4 grid grid-cols-6 gap-4">
        {characters.map((character) => (
          <div key={character.id} className="rounded-xl bg-secondary">
            {character.photo && (
              <img src={character.photo} alt={character.name} />
            )}
            <div className="flex-1">
              <h3 className="text-center text-xl font-bold text-white">
                {character.name}
              </h3>
              <div className="mx-2 mb-2 grid grid-cols-2 gap-2">
                <Button
                  onClick={() => deleteCharacter(character.id)}
                  className="bg-yellow-500 hover:bg-yellow-600"
                >
                  Edit
                </Button>{" "}
                <Button
                  onClick={() => deleteCharacter(character.id)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  <FaTrash />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup */}
      <AddCharacterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
      />
    </div>
  );
}
