import { ImagePlus, RotateCcw, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

const acceptedTypes = ["image/jpeg", "image/png", "image/jpg"];

export default function UploadBox({ file, previewUrl, onFileSelect, onRemove }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  function handleFile(nextFile) {
    if (!nextFile) return;
    if (!acceptedTypes.includes(nextFile.type)) {
      setError("Upload a JPG or PNG leaf image.");
      return;
    }
    setError("");
    onFileSelect(nextFile);
  }

  return (
    <div className="rounded-lg border border-forest-100 bg-white p-4 shadow-soft">
      <div
        className={`grid min-h-[320px] place-items-center rounded-lg border-2 border-dashed p-4 text-center transition ${
          dragging ? "border-forest-500 bg-forest-50" : "border-forest-200 bg-[#fbfdf8]"
        }`}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFile(event.dataTransfer.files?.[0]);
        }}
      >
        {previewUrl ? (
          <div className="w-full">
            <img
              src={previewUrl}
              alt="Uploaded plant leaf preview"
              className="mx-auto h-64 w-full rounded-md object-cover sm:h-80"
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="min-w-0 flex-1 truncate text-left text-sm font-medium text-slate-700">{file?.name}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md border border-forest-200 px-3 py-2 text-sm font-semibold text-forest-800 hover:bg-forest-50"
                  onClick={() => inputRef.current?.click()}
                >
                  <RotateCcw size={16} aria-hidden="true" />
                  Replace
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                  onClick={onRemove}
                >
                  <Trash2 size={16} aria-hidden="true" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-forest-100 text-forest-700">
              <UploadCloud size={30} aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-forest-900">Upload a leaf image</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Drag and drop a JPG or PNG image, or choose a file from your device.
            </p>
            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-forest-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-forest-800"
              onClick={() => inputRef.current?.click()}
            >
              <ImagePlus size={18} aria-hidden="true" />
              Choose Image
            </button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      {error && <p className="mt-3 text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
}
