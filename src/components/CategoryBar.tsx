import {
  Bath,
  BedDouble,
  CalendarDays,
  Clock3,
  Hash,
  Home,
  Sofa,
  Sparkles,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import type { FilterId, TopicId } from "../types";

type Child = { id: TopicId; label: string; icon?: typeof Sparkles };

const FILTERS: {
  id: FilterId;
  label: string;
  short: string;
  icon: typeof Sparkles;
  children: Child[];
}[] = [
  { id: "quick", label: "Quick Review", short: "Quick Review • Mixed mode", icon: Sparkles, children: [] },
  {
    id: "household",
    label: "Casa & Household",
    short: "Casa & Household",
    icon: Home,
    children: [
      { id: "soggiorno", label: "Soggiorno", icon: Sofa },
      { id: "bagno", label: "Bagno", icon: Bath },
      { id: "camera", label: "Camera da letto", icon: BedDouble },
      { id: "cucina", label: "Cucina", icon: UtensilsCrossed },
    ],
  },
  {
    id: "calendar",
    label: "Calendar & Time",
    short: "Calendar & Time",
    icon: CalendarDays,
    children: [
      { id: "days", label: "Days", icon: CalendarDays },
      { id: "months", label: "Months & year", icon: CalendarDays },
      { id: "moments", label: "Moments", icon: Clock3 },
    ],
  },
  {
    id: "ordinals",
    label: "Ordinal Numbers",
    short: "Ordinal Numbers",
    icon: Hash,
    children: [
      { id: "early", label: "1st–5th" },
      { id: "later", label: "6th–10th" },
    ],
  },
  {
    id: "verbs",
    label: "Essential Verbs",
    short: "Essential Verbs",
    icon: Zap,
    children: [
      { id: "aux", label: "Auxiliaries" },
      { id: "motion", label: "Motion" },
      { id: "daily", label: "Everyday" },
    ],
  },
];

type CategoryBarProps = {
  value: FilterId;
  topic: TopicId | null;
  onChange: (value: FilterId, topic: TopicId | null) => void;
};

export function CategoryBar({ value, topic, onChange }: CategoryBarProps) {
  const active = FILTERS.find((filter) => filter.id === value);

  return (
    <div className="space-y-2">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((filter) => {
          const Icon = filter.icon;
          const selected = filter.id === value;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onChange(filter.id, null)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition ${
                selected
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

      {active && active.children.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 pl-1" aria-label={`${active.label} topics`}>
          {active.children.map((child) => {
            const Icon = child.icon;
            const selected = topic === child.id;
            return (
              <button
                key={child.id}
                type="button"
                onClick={() => onChange(active.id, selected ? null : child.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                  selected
                    ? "border-emerald-400/70 bg-emerald-500 text-slate-950"
                    : "border-slate-800 bg-[#0f172a] text-slate-300 hover:border-slate-600"
                }`}
              >
                {Icon && <Icon className="h-3 w-3" />}
                {child.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function filterLabel(id: FilterId, topic: TopicId | null) {
  const filter = FILTERS.find((item) => item.id === id);
  if (!filter) return "";
  const child = filter.children.find((item) => item.id === topic);
  if (child) return `${filter.short} • ${child.label}`;
  return filter.short;
}
