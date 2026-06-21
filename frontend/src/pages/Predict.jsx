import { Activity, Loader2, ServerCrash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PredictionCard from "../components/PredictionCard.jsx";
import UploadBox from "../components/UploadBox.jsx";
import { predictDisease } from "../services/api.js";
import { savePrediction } from "../services/history.js";

export default function Predict() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => Boolean(file) && !loading, [file, loading]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileSelect(nextFile) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
    setResult(null);
    setError("");
  }

  function handleRemove() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl("");
    setResult(null);
    setError("");
  }

  async function handleDetect() {
    if (!file) return;
    setLoading(true);
    setError("");

    try {
      const prediction = await predictDisease(file);
      const historyImageUrl = await readFileAsDataUrl(file);
      setResult(prediction);
      savePrediction({
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        imageUrl: historyImageUrl,
        ...prediction
      });
    } catch (requestError) {
      setError(
        requestError?.response?.data?.error ||
          "The prediction service is not reachable. Start the Flask backend and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-shell py-10">
      <div className="mb-8 max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-md bg-forest-100 px-3 py-2 text-sm font-semibold text-forest-800">
          <Activity size={16} aria-hidden="true" />
          Disease Detection Module
        </span>
        <h1 className="mt-4 text-3xl font-bold text-forest-950 sm:text-4xl">Analyze a plant leaf image</h1>
        <p className="mt-3 leading-7 text-slate-600">
          Upload a clear leaf image to receive the predicted disease, confidence score, treatment recommendation, and
          prevention advice.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <UploadBox file={file} previewUrl={previewUrl} onFileSelect={handleFileSelect} onRemove={handleRemove} />
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleDetect}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-forest-700 px-5 py-3 font-semibold text-white shadow-sm hover:bg-forest-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : <Activity size={18} aria-hidden="true" />}
            {loading ? "Analyzing Image" : "Detect Disease"}
          </button>
          {error && (
            <div className="mt-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <ServerCrash className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
              <p>{error}</p>
            </div>
          )}
        </div>
        <PredictionCard result={result} />
      </div>
    </section>
  );
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
