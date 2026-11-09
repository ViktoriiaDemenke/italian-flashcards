import { CalendarDays, Hash, Home, Sparkles, Zap } from "lucide-react";
import type { FilterId } from "../types";

const FILTERS: { id: FilterId; label: string; icon: typeof Sparkles }[] = [
  { id: "quick", label: "Quick Review (Mixed Mode)", icon: Sparkles },
  { id: "household", label: "Household & Objects", icon: Home },
  { id: "calendar", label: "Calendar & Time", icon: CalendarDays },
  { id: "ordinals", label: "Ordinal Numbers", icon: Hash },
  { id: "verbs", label: "Essential Verbs", icon: Zap },
];

type CategoryBarProps = {
  value: FilterId;
  onChange: (value: FilterId) => void;
};

export function CategoryBar({ value, onChange }: CategoryBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {FILTERS.map((filter) => {
        const Icon = filter.icon;
        const active = filter.id === value;
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition ${
              active
                ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-200 shadow-[0_0_16px_rgba(16,185,129,0.22)]"
                : "border-slate-800 bg-[#111827] text-slate-300 hover:border-slate-600"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

export function filterLabel(id: FilterId) {
  if (id === "quick") return "Quick Review • Mixed mode";
  return FILTERS.find((filter) => filter.id === id)?.label ?? "";
}
