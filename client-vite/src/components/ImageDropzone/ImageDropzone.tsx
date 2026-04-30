import { useRef, useState, DragEvent, ChangeEvent } from "react";
import "./ImageDropzone.scss";
import { LuImagePlus } from "react-icons/lu";
import { uploadsApi } from "../../api/uploadsApi";
import { toast } from "react-toastify";

interface ImageDropzoneProps {
  value: string | null;
  onUploadComplete: (url: string | null) => void;
  onLoadingChange: (loading: boolean) => void;
}

export const ImageDropzone = ({
  value,
  onUploadComplete,
  onLoadingChange,
}: ImageDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const preview = localPreview ?? value;

  const handleFile = async (file: File) => {
    setLocalPreview(URL.createObjectURL(file));
    setUploading(true);
    onLoadingChange(true);
    try {
      const result = await uploadsApi.upload(file);
      setLocalPreview(null);
      onUploadComplete(result.secureUrl);
    } catch {
      toast.error("Image upload failed.");
      setLocalPreview(null);
      if (inputRef.current) inputRef.current.value = "";
    } finally {
      setUploading(false);
      onLoadingChange(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setLocalPreview(null);
    onUploadComplete(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      className={`image-dropzone${dragging ? " dragging" : ""}`}
      onClick={() => !preview && !uploading && inputRef.current?.click()}
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
          {uploading && (
            <div className="dropzone-loading">
              <span className="spinner-border" />
            </div>
          )}
          {!uploading && (
            <>
              <img
                src={preview}
                alt="cover preview"
                className="dropzone-preview"
              />
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
          )}
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
