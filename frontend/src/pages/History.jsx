import { History as HistoryIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import HistoryCard from "../components/HistoryCard.jsx";
import { clearHistory, getHistory } from "../services/history.js";

export default function History() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getHistory());
  }, []);

  function handleClear() {
    clearHistory();
    setItems([]);
  }

  return (
    <section className="page-shell py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-md bg-forest-100 px-3 py-2 text-sm font-semibold text-forest-800">
            <HistoryIcon size={16} aria-hidden="true" />
            Prediction History
          </span>
          <h1 className="mt-4 text-3xl font-bold text-forest-950 sm:text-4xl">Recent detections</h1>
          <p className="mt-3 leading-7 text-slate-600">
            Review recent prediction results stored in this browser.
          </p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-4 py-3 font-semibold text-red-700 hover:bg-red-50"
          >
            <Trash2 size={18} aria-hidden="true" />
            Clear History
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-forest-100 bg-white p-8 text-center shadow-soft">
          <p className="text-lg font-semibold text-forest-950">No predictions yet</p>
          <p className="mt-2 text-slate-600">Run a disease detection to build your local history.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
