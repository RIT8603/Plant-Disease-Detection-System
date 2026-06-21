import { CalendarDays, Gauge } from "lucide-react";

export default function HistoryCard({ item }) {
  const date = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(item.createdAt));

  return (
    <article className="grid gap-4 rounded-lg border border-forest-100 bg-white p-4 shadow-soft sm:grid-cols-[140px_1fr]">
      <img src={item.imageUrl} alt={item.disease} className="h-36 w-full rounded-md object-cover sm:h-full" />
      <div className="flex min-w-0 flex-col justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-forest-950">{item.disease}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.treatment}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2 rounded-md bg-forest-50 px-3 py-2 font-medium text-forest-800">
            <Gauge size={16} aria-hidden="true" />
            {Number(item.confidence).toFixed(1)}%
          </span>
          <span className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2">
            <CalendarDays size={16} aria-hidden="true" />
            {date}
          </span>
        </div>
      </div>
    </article>
  );
}
