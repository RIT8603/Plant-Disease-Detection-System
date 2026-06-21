import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/predict", label: "Detect" },
  { to: "/history", label: "History" },
  { to: "/about", label: "About" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-forest-100 bg-white/90 backdrop-blur">
      <nav className="page-shell flex h-16 items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 font-semibold text-forest-800">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-forest-700 text-white">
            <Leaf size={20} aria-hidden="true" />
          </span>
          <span>PlantDx</span>
        </NavLink>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive ? "bg-forest-100 text-forest-800" : "text-slate-600 hover:bg-forest-50 hover:text-forest-800"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-md border border-forest-100 text-forest-800 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-forest-100 bg-white md:hidden">
          <div className="page-shell grid gap-1 py-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-forest-100 text-forest-800" : "text-slate-600"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
