import {
  Banknote,
  Bath,
  BedDouble,
  Building2,
  Bus,
  FileText,
  Hash,
  HeartPulse,
  Home,
  Landmark,
  MessageCircle,
  Shirt,
  ShoppingBag,
  Smile,
  Sofa,
  Sparkles,
  UtensilsCrossed,
  Wrench,
  Zap,
} from "lucide-react";
import { topicsOnLevel } from "../data/deck";
import { t, type UiKey } from "../lib/ui";
import type { CategoryId, FilterId, Level, MotherTongue, TopicId } from "../types";

const ICONS = {
  home: Home,
  numbers: Hash,
  verbs: Zap,
  city: Building2,
  transport: Bus,
  shopping: ShoppingBag,
  clothes: Shirt,
  health: HeartPulse,
  emotions: Smile,
  bureaucracy: FileText,
  rent: Wrench,
  slang: MessageCircle,
  society: Landmark,
  social: Sparkles,
  finance: Banknote,
  idioms: MessageCircle,
  living: Sofa,
  bath: Bath,
  bedroom: BedDouble,
  kitchen: UtensilsCrossed,
} as const;

type Child = { id: TopicId; labelKey: UiKey };

type Filter = {
  id: FilterId;
  labelKey: UiKey;
  icon: typeof Sparkles;
  children: Child[];
};

function labelKey(id: string): UiKey {
  return id as UiKey;
}

export function filtersForLevel(level: Level): Filter[] {
  const grouped = new Map<CategoryId, TopicId[]>();
  for (const item of topicsOnLevel(level)) {
    const list = grouped.get(item.category) ?? [];
    list.push(item.topic);
    grouped.set(item.category, list);
  }
  const filters: Filter[] = [
    { id: "quick", labelKey: "quick", icon: Sparkles, children: [] },
  ];
  for (const [category, topics] of grouped) {
    filters.push({
      id: category,
      labelKey: labelKey(category),
      icon: ICONS[category as keyof typeof ICONS] ?? Sparkles,
      children: topics.map((topic) => ({
        id: topic,
        labelKey: labelKey(topic),
      })),
    });
  }
  return filters;
}

function childLabel(child: Child, tongue: MotherTongue) {
  return t(tongue, child.labelKey);
}

type CategoryBarProps = {
  level: Level;
  value: FilterId;
  topic: TopicId | null;
  tongue: MotherTongue;
  onChange: (value: FilterId, topic: TopicId | null) => void;
};

export function CategoryBar({ level, value, topic, tongue, onChange }: CategoryBarProps) {
  const filters = filtersForLevel(level);
  const active = filters.find((filter) => filter.id === value) ?? filters[0];

  return (
    <div className="space-y-2">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const selected = filter.id === value;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onChange(filter.id, filter.children[0]?.id ?? null)}
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

      {active && active.children.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 pl-1" aria-label={`${t(tongue, active.labelKey)} topics`}>
          {active.children.map((child) => {
            const selected = topic === child.id;
            return (
              <button
                key={child.id}
                type="button"
                onClick={() => onChange(active.id, child.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                  selected
                    ? "border-emerald-400/70 bg-emerald-500 text-slate-950"
                    : "border-slate-800 bg-[#0f172a] text-slate-300 hover:border-slate-600"
                }`}
              >
                {childLabel(child, tongue)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function filterLabel(level: Level, id: FilterId, topic: TopicId | null, tongue: MotherTongue) {
  const filter = filtersForLevel(level).find((item) => item.id === id);
  if (!filter) return "";
  const parent = t(tongue, filter.labelKey);
  const child = filter.children.find((item) => item.id === topic);
  if (child && filter.children.length > 1) return `${parent} • ${childLabel(child, tongue)}`;
  if (id === "quick") return `${parent} • ${t(tongue, "mixed")}`;
  return parent;
}
