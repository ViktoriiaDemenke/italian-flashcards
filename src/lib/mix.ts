import { DECK } from "../data/deck";
import type { Level, MotherTongue, StudyCard } from "../types";

const MIX_SIZE = 12;

export function dailyMix(level: Level, repeatIds: string[], studiedIds: string[], savedIds: string[]) {
  const onLevel = DECK.filter((card) => card.level === level);
  const attention = new Set([...repeatIds, ...savedIds]);
  const due = onLevel.filter((card) => attention.has(card.id));
  const fresh = onLevel.filter((card) => !studiedIds.includes(card.id) && !attention.has(card.id));
  const known = onLevel.filter((card) => studiedIds.includes(card.id) && !attention.has(card.id));
  return [...due, ...fresh, ...known].slice(0, MIX_SIZE);
}

export function cardsByIds(ids: string[]) {
  const order = new Map(ids.map((id, index) => [id, index]));
  return DECK.filter((card) => order.has(card.id)).sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
}

const PHOTO_SCENES = new Set(["casa", "home", "cibo", "ristorante_cucina", "vestiti", "clothes", "trasporti", "transport", "mobili_pulizia"]);

export function cardsForPhoto(level: Level) {
  const onLevel = DECK.filter((card) => card.level === level && PHOTO_SCENES.has(card.category));
  const pool = onLevel.length >= 8 ? onLevel : DECK.filter((card) => PHOTO_SCENES.has(card.category));
  return pool.slice(0, MIX_SIZE);
}

export function cardsForTheme(theme: string, tongue: MotherTongue): StudyCard[] {
  const tokens = theme
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((token) => token.length > 2);
  if (tokens.length === 0) return [];
  return DECK.filter((card) => {
    const haystack = [card.italian, card.detail, card.gloss[tongue], card.translation[tongue], card.category, card.topic]
      .join(" ")
      .toLowerCase();
    return tokens.some((token) => haystack.includes(token));
  }).slice(0, MIX_SIZE);
}
