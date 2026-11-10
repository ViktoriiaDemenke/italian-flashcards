import { topicsOnLevel } from "../data/deck";
import { t, type UiKey } from "../lib/ui";
import type { CategoryId, FilterId, Level, MotherTongue, TopicId } from "../types";

type Child = { id: TopicId; labelKey: UiKey };

type Filter = {
  id: CategoryId;
  labelKey: UiKey;
  children: Child[];
};

function labelKey(id: string): UiKey {
  return id as UiKey;
}

export function filtersForLevel(level: Level): Filter[] {
  const grouped = new Map<CategoryId, TopicId[]>();
  for (const item of topicsOnLevel(level)) {
    const list = grouped.get(item.category) ?? [];
    if (!list.includes(item.topic)) list.push(item.topic);
    grouped.set(item.category, list);
  }
  return [...grouped.entries()].map(([category, topics]) => ({
    id: category,
    labelKey: labelKey(category),
    children: topics.map((topic) => ({ id: topic, labelKey: labelKey(topic) })),
  }));
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

const pill =
  "inline-flex shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm transition";

export function CategoryBar({ level, value, topic, tongue, onChange }: CategoryBarProps) {
  const filters = filtersForLevel(level);
  const active = filters.find((filter) => filter.id === value);
  const showChildren = Boolean(active && active.children.length > 1);

  return (
    <div className="space-y-2">
      <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => {
          const selected = filter.id === value;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onChange(filter.id, filter.children[0]?.id ?? null)}
              className={`${pill} ${
                selected
                  ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-200"
                  : "border-slate-800 bg-[#111827] text-slate-300 hover:border-slate-600"
              }`}
            >
              {t(tongue, filter.labelKey)}
            </button>
          );
        })}
      </div>

      {showChildren && active && (
        <div
          className="flex flex-nowrap gap-2 overflow-x-auto pb-1"
          aria-label={`${t(tongue, active.labelKey)} topics`}
        >
          {active.children.map((child) => {
            const selected = topic === child.id;
            return (
              <button
                key={child.id}
                type="button"
                onClick={() => onChange(active.id, child.id)}
                className={`${pill} text-xs ${
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
  return parent;
}
