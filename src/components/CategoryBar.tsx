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
import { t, type UiKey } from "../lib/ui";
import type { FilterId, MotherTongue, TopicId } from "../types";

type Child = { id: TopicId; label?: string; labelKey?: UiKey; icon?: typeof Sparkles };

const FILTERS: {
  id: FilterId;
  labelKey: UiKey;
  icon: typeof Sparkles;
  children: Child[];
}[] = [
  { id: "quick", labelKey: "quick", icon: Sparkles, children: [] },
  {
    id: "household",
    labelKey: "household",
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
    labelKey: "calendar",
    icon: CalendarDays,
    children: [
      { id: "days", labelKey: "days", icon: CalendarDays },
      { id: "months", labelKey: "months", icon: CalendarDays },
      { id: "moments", labelKey: "moments", icon: Clock3 },
    ],
  },
  {
    id: "ordinals",
    labelKey: "ordinals",
    icon: Hash,
    children: [
      { id: "early", labelKey: "early" },
      { id: "later", labelKey: "later" },
    ],
  },
  {
    id: "verbs",
    labelKey: "verbs",
    icon: Zap,
    children: [
      { id: "aux", labelKey: "aux" },
      { id: "motion", labelKey: "motion" },
      { id: "daily", labelKey: "daily" },
    ],
  },
];

function childLabel(child: Child, tongue: MotherTongue) {
  if (child.label) return child.label;
  return child.labelKey ? t(tongue, child.labelKey) : "";
}

type CategoryBarProps = {
  value: FilterId;
  topic: TopicId | null;
  tongue: MotherTongue;
  onChange: (value: FilterId, topic: TopicId | null) => void;
};

export function CategoryBar({ value, topic, tongue, onChange }: CategoryBarProps) {
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
              {t(tongue, filter.labelKey)}
            </button>
          );
        })}
      </div>

      {active && active.children.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 pl-1" aria-label={`${t(tongue, active.labelKey)} topics`}>
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
                {childLabel(child, tongue)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function filterLabel(id: FilterId, topic: TopicId | null, tongue: MotherTongue) {
  const filter = FILTERS.find((item) => item.id === id);
  if (!filter) return "";
  const parent = t(tongue, filter.labelKey);
  const child = filter.children.find((item) => item.id === topic);
  if (child) return `${parent} • ${childLabel(child, tongue)}`;
  if (id === "quick") return `${parent} • ${t(tongue, "mixed")}`;
  return parent;
}
