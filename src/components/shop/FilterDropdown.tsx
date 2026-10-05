"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export type Option = { value: string; label: string };

export function CheckboxList({ options, values, onToggle }: { options: Option[]; values: string[]; onToggle: (value: string) => void }) {
  return (
    <ul className="space-y-2.5">
      {options.map((o) => (
        <li key={o.value}>
          <label className="flex cursor-pointer items-center gap-3 text-sm hover:text-gold">
            <input type="checkbox" checked={values.includes(o.value)} onChange={() => onToggle(o.value)} className="h-4 w-4 shrink-0 accent-ink" />
            {o.label}
          </label>
        </li>
      ))}
    </ul>
  );
}

/** Toolbar dropdown for one filter; changes apply immediately. */
export default function FilterDropdown({
  label,
  options,
  values,
  onChange,
}: {
  label: string;
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = (value: string) => onChange(values.includes(value) ? values.filter((v) => v !== value) : [...values, value]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 border bg-card px-4 py-2 text-sm transition-colors hover:border-ink ${values.length > 0 ? "border-ink" : "border-line"}`}
      >
        {label}
        {values.length > 0 && <span className="text-gold">({values.length})</span>}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-30 mt-2 w-60 border border-line bg-paper p-4 shadow-lg">
          <CheckboxList options={options} values={values} onToggle={toggle} />
          {values.length > 0 && (
            <button type="button" onClick={() => onChange([])} className="mt-4 text-xs underline underline-offset-4 hover:text-gold">
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
