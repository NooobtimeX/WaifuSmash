import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AvatarEditorModal from "@/components/AvatarEditorModal";

interface AddCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, photo: File | null) => void;
  isSubmitting: boolean;
  error: string;
}

const AddCharacterModal: React.FC<AddCharacterModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}) => {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [isAvatarEditorOpen, setIsAvatarEditorOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedPhoto(e.target.files[0]);
      setIsAvatarEditorOpen(true);
    }
  };

  const handleSaveCroppedImage = (croppedImage: Blob) => {
    const file = new File([croppedImage], "cropped_image.png", {
      type: "image/png",
    });
    setPhoto(file);
    setIsAvatarEditorOpen(false);
  };

  const handleCancelAvatarEditor = () => {
    setSelectedPhoto(null);
    setIsAvatarEditorOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, photo);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Add New Character</h2>
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="photo" className="block text-gray-700">
              Photo
            </label>
            <input
              type="file"
              id="photo"
              onChange={handlePhotoChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Character"}
            </Button>
          </div>
        </form>
      </div>

      <AvatarEditorModal
        isOpen={isAvatarEditorOpen}
        onRequestClose={handleCancelAvatarEditor}
        photo={selectedPhoto}
        onSave={handleSaveCroppedImage}
      />
    </div>
  );
};

export default AddCharacterModal;
