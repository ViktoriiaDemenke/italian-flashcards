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

function filtersForLevel(level: Level): Filter[] {
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

export function filterLabel(level: Level, id: FilterId, topic: TopicId | null, tongue: MotherTongue) {
  const filter = filtersForLevel(level).find((item) => item.id === id);
  if (!filter) return "";
  const parent = t(tongue, filter.labelKey);
  const child = filter.children.find((item) => item.id === topic);
  if (child && filter.children.length > 1) return `${parent} • ${childLabel(child, tongue)}`;
  return parent;
}
