import { AlertTriangle, BadgeCheck, ClipboardList, ShieldCheck, Sprout } from "lucide-react";

function categoryTone(category = "") {
  if (category.toLowerCase().includes("healthy")) {
    return "bg-forest-100 text-forest-800";
  }
  return "bg-amber-100 text-amber-800";
}

export default function PredictionCard({ result }) {
  if (!result) {
    return (
      <div className="rounded-lg border border-forest-100 bg-white p-6 shadow-soft">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-forest-100 text-forest-700">
            <Sprout size={22} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-forest-900">Diagnosis results</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Upload a clear leaf image and run detection to view disease, confidence, treatment, and prevention guidance.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const confidence = Number(result.confidence || 0);

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-forest-100 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-forest-100 text-forest-700">
              <BadgeCheck size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-forest-700">Prediction</p>
              <h2 className="mt-1 text-2xl font-bold text-forest-950">{result.disease}</h2>
              <span className={`mt-3 inline-flex rounded-md px-3 py-1 text-sm font-semibold ${categoryTone(result.category)}`}>
                {result.category || "Disease"}
              </span>
            </div>
          </div>
          <div className="rounded-lg bg-forest-50 p-4 sm:w-48">
            <p className="text-sm font-medium text-slate-600">Confidence</p>
            <p className="mt-1 text-3xl font-bold text-forest-900">{confidence.toFixed(1)}%</p>
            <div className="mt-3 h-2 rounded-full bg-forest-100">
              <div className="h-2 rounded-full bg-forest-600" style={{ width: `${Math.min(confidence, 100)}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <InfoPanel
          icon={<ClipboardList size={22} aria-hidden="true" />}
          title="Treatment Recommendation"
          body={result.treatment}
        />
        <InfoPanel icon={<ShieldCheck size={22} aria-hidden="true" />} title="Prevention Tips" body={result.prevention} />
      </section>

      {result.note && (
        <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
          <p>{result.note}</p>
        </div>
      )}
    </div>
  );
}

function InfoPanel({ icon, title, body }) {
  return (
    <article className="rounded-lg border border-forest-100 bg-white p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-forest-100 text-forest-700">{icon}</div>
        <div>
          <h3 className="font-semibold text-forest-900">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
        </div>
      </div>
    </article>
  );
}
