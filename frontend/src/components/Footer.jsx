import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-forest-100 bg-forest-900 text-forest-50">
      <div className="page-shell flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Leaf size={18} aria-hidden="true" />
          <span className="font-semibold">PlantDx</span>
        </div>
        <p className="max-w-2xl text-sm text-forest-100">
          Machine learning assisted disease detection for faster field decisions, treatment planning, and prevention.
        </p>
      </div>
    </footer>
  );
}
