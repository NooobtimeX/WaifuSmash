import React, { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import Modal from "react-modal";

interface AvatarEditorModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  photo: File | null;
  onSave: (croppedImage: Blob) => void;
}

const AvatarEditorModal: React.FC<AvatarEditorModalProps> = ({
  isOpen,
  onRequestClose,
  photo,
  onSave,
}) => {
  const editorRef = useRef<AvatarEditor>(null);
  const [scale, setScale] = useState(1);

  const handleSave = () => {
    if (editorRef.current) {
      editorRef.current.getImageScaledToCanvas().toBlob((blob) => {
        if (blob) {
          onSave(blob);
        }
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Photo"
      ariaHideApp={false}
      className="z-60 fixed inset-0 flex items-center justify-center" // Increased z-index
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50" // Ensure overlay has lower z-index
    >
      <div className="w-full max-w-xl rounded-lg bg-gray-800 p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Edit Photo</h2>
        {photo && (
          <div className="mb-4">
            <AvatarEditor
              ref={editorRef}
              image={photo}
              width={500}
              height={500}
              border={5}
              scale={scale}
              className="mx-auto my-auto w-1"
            />
            <input
              type="range"
              value={scale}
              min="1"
              max="2"
              step="0.01"
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="mt-4 w-full"
            />
          </div>
        )}
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSave}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={onRequestClose}
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AvatarEditorModal;
