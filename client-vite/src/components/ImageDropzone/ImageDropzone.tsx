import { useRef, useState, DragEvent, ChangeEvent } from "react";
import "./ImageDropzone.scss";
import { LuImagePlus } from "react-icons/lu";

interface ImageDropzoneProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

export const ImageDropzone = ({ value, onChange }: ImageDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const preview = value ? URL.createObjectURL(value) : null;

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) onChange(file);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files?.[0] ?? null);
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      className={`image-dropzone${dragging ? " dragging" : ""}`}
      onClick={() => !value && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="d-none"
        onChange={handleFileInput}
      />
      {preview ? (
        <>
          <img src={preview} alt="cover preview" className="dropzone-preview" />
          <button
            type="button"
            className="dropzone-remove"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
          >
            ✕
          </button>
        </>
      ) : (
        <div className="dropzone-placeholder">
          <LuImagePlus className="dropzone-icon" />
          <span>
            Drag & drop or <u>browse</u>
          </span>
        </div>
      )}
    </div>
  );
};
