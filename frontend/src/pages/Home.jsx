import { ArrowRight, BarChart3, CloudUpload, History, Leaf, ShieldCheck, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { icon: CloudUpload, title: "Simple Uploads", body: "Drop a leaf image into the detector from desktop, tablet, or phone." },
  { icon: Stethoscope, title: "AI Diagnosis", body: "Connects to the trained disease model through a Flask prediction API." },
  { icon: BarChart3, title: "Confidence Scores", body: "Shows model confidence with clear visual indicators for quick interpretation." },
  { icon: ShieldCheck, title: "Actionable Guidance", body: "Returns treatment recommendations and prevention best practices." },
  { icon: History, title: "Prediction History", body: "Keeps recent detections locally for review and demonstrations." }
];

const steps = ["Upload a clear leaf photo", "Run the disease detector", "Review the diagnosis", "Apply treatment and prevention guidance"];

export default function Home() {
  return (
    <>
      <section className="bg-[linear-gradient(120deg,rgba(238,248,239,0.95),rgba(255,255,255,0.88)),url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center">
        <div className="page-shell grid min-h-[calc(100vh-4rem)] items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-md bg-white/80 px-3 py-2 text-sm font-semibold text-forest-800 shadow-sm">
              <Leaf size={16} aria-hidden="true" />
              Smart crop health assistant
            </span>
            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight text-forest-950 sm:text-5xl lg:text-6xl">
              AI-Powered Plant Disease Detection
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              Upload a plant leaf image and receive instant disease diagnosis, treatment recommendations, and prevention
              tips powered by Machine Learning.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/predict"
                className="inline-flex items-center gap-2 rounded-md bg-forest-700 px-5 py-3 font-semibold text-white shadow-sm hover:bg-forest-800"
              >
                Start Detection
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center rounded-md border border-forest-200 bg-white/80 px-5 py-3 font-semibold text-forest-800 hover:bg-white"
              >
                View Project Details
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur">
            <div className="grid gap-4">
              {["Tomato Early Blight", "Apple Cedar Rust", "Potato Late Blight"].map((label, index) => (
                <div key={label} className="rounded-lg border border-forest-100 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-forest-900">{label}</p>
                    <span className="rounded-md bg-forest-100 px-2.5 py-1 text-sm font-bold text-forest-800">
                      {96 - index * 5}%
                    </span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-forest-100">
                    <div className="h-2 rounded-full bg-forest-600" style={{ width: `${96 - index * 5}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="page-shell py-14">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-forest-950">A complete product layer for the trained ML model</h2>
            <p className="mt-3 leading-7 text-slate-600">
              The platform turns the existing machine learning work into a practical web experience for farmers,
              researchers, students, and agricultural teams.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-lg border border-forest-100 bg-white p-5">
                <feature.icon className="text-forest-700" size={24} aria-hidden="true" />
                <h3 className="mt-4 font-semibold text-forest-950">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="page-shell grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-bold text-forest-950">How It Works</h2>
            <p className="mt-3 leading-7 text-slate-600">
              The workflow is designed for quick field use and clean academic demonstrations.
            </p>
          </div>
          <div className="grid gap-3">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-4 rounded-lg border border-forest-100 bg-white p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-forest-700 font-bold text-white">
                  {index + 1}
                </span>
                <p className="font-medium text-slate-800">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
