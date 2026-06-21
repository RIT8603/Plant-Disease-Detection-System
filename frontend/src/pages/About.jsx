import { BrainCircuit, Code2, Database, FlaskConical, Layers3, Target } from "lucide-react";

const stack = [
  { title: "Frontend", body: "React, Tailwind CSS, React Router, Axios", icon: Code2 },
  { title: "Backend", body: "Python Flask API for image upload and prediction", icon: FlaskConical },
  { title: "Machine Learning", body: "TensorFlow/Keras CNN model with OpenCV and NumPy preprocessing", icon: BrainCircuit },
  { title: "Dataset", body: "Augmented plant disease dataset with 38 disease and healthy classes", icon: Database }
];

export default function About() {
  return (
    <section className="page-shell py-10">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-md bg-forest-100 px-3 py-2 text-sm font-semibold text-forest-800">
          <Target size={16} aria-hidden="true" />
          About Project
        </span>
        <h1 className="mt-4 text-3xl font-bold text-forest-950 sm:text-4xl">A practical AI assistant for crop health</h1>
        <p className="mt-3 leading-7 text-slate-600">
          PlantDx was developed to make trained plant disease models usable beyond notebooks. It gives users a clean
          workflow for uploading leaf images, viewing prediction confidence, and acting on treatment and prevention
          guidance.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-lg border border-forest-100 bg-white p-6 shadow-soft">
          <div className="grid h-12 w-12 place-items-center rounded-md bg-forest-100 text-forest-700">
            <Layers3 size={24} aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-forest-950">Machine Learning Model</h2>
          <p className="mt-3 leading-7 text-slate-600">
            The notebook trains a convolutional neural network on resized 224 by 224 RGB leaf images. The model outputs
            probabilities across 38 classes, including healthy leaves and diseases for crops such as apple, corn,
            grape, potato, and tomato.
          </p>
          <div className="mt-5 rounded-lg bg-forest-50 p-4 text-sm leading-6 text-forest-900">
            Place the exported Keras model in the backend model path configured by <code>MODEL_PATH</code> to enable live
            predictions.
          </div>
        </article>

        <div className="grid gap-4 sm:grid-cols-2">
          {stack.map((item) => (
            <article key={item.title} className="rounded-lg border border-forest-100 bg-white p-5 shadow-soft">
              <item.icon className="text-forest-700" size={24} aria-hidden="true" />
              <h3 className="mt-4 font-semibold text-forest-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
