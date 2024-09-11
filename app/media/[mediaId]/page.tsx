"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use useParams in app router

interface Character {
  id: number;
  name: string;
  photo: string | null;
}

interface Media {
  id: number;
  name: string;
  description: string | null;
  photo: string | null;
  createdAt: string;
  updatedAt: string;
  characters: Character[];
}

const MediaDetailPage = () => {
  const params = useParams(); // Get mediaId from the route
  const mediaId = params.mediaId;

  const [media, setMedia] = useState<Media | null>(null);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState<number>(
    () => {
      const savedIndex = localStorage.getItem(
        `currentCharacterIndex_${mediaId}`,
      );
      return savedIndex ? parseInt(savedIndex, 10) : 0;
    },
  );
  const [error, setError] = useState<string | null>(null);
  const [userSelections, setUserSelections] = useState<string[]>(() => {
    const savedSelections = localStorage.getItem(`selections_${mediaId}`);
    return savedSelections ? JSON.parse(savedSelections) : [];
  });

  const totalSmash = userSelections.filter((sel) =>
    sel.includes("smash"),
  ).length;
  const totalPass = userSelections.filter((sel) => sel.includes("pass")).length;

  useEffect(() => {
    if (mediaId) {
      const cachedMedia = localStorage.getItem(`media_${mediaId}`);
      const cachedTimestamp = localStorage.getItem(
        `media_timestamp_${mediaId}`,
      );

      if (cachedMedia && cachedTimestamp) {
        const now = new Date().getTime();
        const cacheAge = now - parseInt(cachedTimestamp, 10);

        // If the cache is less than 10 minutes old (600,000 ms), use cached data
        if (cacheAge < 600000) {
          setMedia(JSON.parse(cachedMedia));
          return;
        }
      }

      const fetchMedia = async () => {
        try {
          const response = await fetch(`/api/media/${mediaId}`);
          if (!response.ok) {
            throw new Error("Failed to load media");
          }
          const data = await response.json();
          setMedia(data);

          // Save media data and timestamp in localStorage
          localStorage.setItem(`media_${mediaId}`, JSON.stringify(data));
          localStorage.setItem(
            `media_timestamp_${mediaId}`,
            new Date().getTime().toString(),
          );

          // Preload images to cache them
          data.characters.forEach((character: Character) => {
            if (character.photo) {
              const img = new Image();
              img.src = character.photo;
            }
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("An unknown error occurred.");
          }
        }
      };

      fetchMedia();
    }
  }, [mediaId]);

  useEffect(() => {
    // Persist current character index to localStorage
    localStorage.setItem(
      `currentCharacterIndex_${mediaId}`,
      currentCharacterIndex.toString(),
    );
  }, [currentCharacterIndex, mediaId]);

  const handleSelection = (
    characterId: number,
    selection: "smash" | "pass",
  ) => {
    setUserSelections((prev) => {
      const updatedSelections = [...prev, `${characterId}:${selection}`];
      localStorage.setItem(
        `selections_${mediaId}`,
        JSON.stringify(updatedSelections),
      );
      return updatedSelections;
    });

    // Move to the next character
    setCurrentCharacterIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    localStorage.removeItem(`selections_${mediaId}`);
    localStorage.removeItem(`currentCharacterIndex_${mediaId}`);
    setUserSelections([]);
    setCurrentCharacterIndex(0);
  };

  const getSelectedCharacters = (selection: "smash" | "pass") => {
    return userSelections
      .filter((sel) => sel.includes(selection))
      .map((sel) => {
        const characterId = parseInt(sel.split(":")[0], 10);
        return media?.characters.find((char) => char.id === characterId);
      });
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!media || media.characters.length === 0) {
    return <div className="text-white">Loading media...</div>;
  }

  // Show only the current character
  const currentCharacter = media.characters[currentCharacterIndex];

  if (currentCharacterIndex >= media.characters.length) {
    const smashedCharacters = getSelectedCharacters("smash");
    const passedCharacters = getSelectedCharacters("pass");

    return (
      <div className="flex min-h-screen flex-col items-center bg-black p-4 text-white">
        <h1 className="mb-6 text-4xl font-bold text-red-500">Waifu Smash</h1>
        <h2 className="mb-6 text-4xl font-bold text-red-500">
          {media.name} - Selection Report
        </h2>
        <div className="mt-8 w-full max-w-4xl">
          <div>
            <h3 className="text-2xl font-bold text-green-500">Smash</h3>
            {smashedCharacters && smashedCharacters.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {smashedCharacters.map(
                  (char) =>
                    char && (
                      <div
                        key={char.id}
                        className="rounded-xl bg-gray-800 p-1 shadow-lg"
                      >
                        <img
                          src={char.photo || ""}
                          alt={char.name}
                          className="h-40 w-full rounded-xl object-cover"
                        />
                        <h4 className="mt-2 text-xl font-semibold text-white">
                          {char.name}
                        </h4>
                      </div>
                    ),
                )}
              </div>
            ) : (
              <p className="text-gray-400">You didn &apos; t smash anyone.</p>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-bold text-blue-500">Pass</h3>
            {passedCharacters && passedCharacters.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {passedCharacters.map(
                  (char) =>
                    char && (
                      <div
                        key={char.id}
                        className="rounded-xl bg-gray-800 p-4 shadow-lg"
                      >
                        <img
                          src={char.photo || ""}
                          alt={char.name}
                          className="h-40 w-full rounded-xl object-cover"
                        />
                        <h4 className="mt-2 text-xl font-semibold text-white">
                          {char.name}
                        </h4>
                      </div>
                    ),
                )}
              </div>
            ) : (
              <p className="text-gray-400">You didn &apos; t pass on anyone.</p>
            )}
          </div>

          <button
            className="mt-8 rounded-xl bg-red-500 px-6 py-3 text-lg text-white"
            onClick={handleRestart}
          >
            Restart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-black p-4 text-white">
      <h1 className="mb-6 text-4xl font-bold text-red-500">Waifu Smash</h1>
      <h2 className="mb-6 text-4xl font-bold text-red-500">{media.name}</h2>
      {currentCharacter ? (
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="relative h-80 w-80 rounded-xl bg-gray-800 p-2 shadow-lg">
              {currentCharacter.photo && (
                <img
                  src={currentCharacter.photo}
                  alt={currentCharacter.name}
                  className="h-full w-full rounded-xl object-cover"
                />
              )}
              <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                {currentCharacter.name}
              </h3>
            </div>
          </div>

          <p className="mt-4 text-lg font-semibold text-white">
            Character {currentCharacterIndex + 1} of {media.characters.length}
          </p>

          <div className="mt-8 flex space-x-4">
            <button
              className="flex items-center justify-center border-2 border-green-500 bg-black px-8 py-3 text-xl font-bold text-green-500 hover:bg-green-500 hover:text-white"
              onClick={() => handleSelection(currentCharacter.id, "smash")}
            >
              SMASH {totalSmash}
            </button>
            <button
              className="flex items-center justify-center border-2 border-red-500 bg-black px-8 py-3 text-xl font-bold text-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => handleSelection(currentCharacter.id, "pass")}
            >
              PASS {totalPass}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-lg text-gray-300">No more characters to show.</p>
      )}
    </div>
  );
};

export default MediaDetailPage;
