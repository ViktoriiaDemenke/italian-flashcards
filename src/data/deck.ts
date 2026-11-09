import { CALENDAR_CARDS } from "./calendarCards";
import { HOME_CARDS } from "./homeCards";
import { LEXICON_CARDS } from "./lexiconCards";
import { VERB_CARDS } from "./verbCards";
import type { Level, StudyCard, TenseId } from "../types";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2"];

function tagLevels(cards: StudyCard[]): StudyCard[] {
  const buckets = new Map<string, StudyCard[]>();
  for (const card of cards) {
    const key = `${card.category}:${card.topic}`;
    buckets.set(key, [...(buckets.get(key) ?? []), card]);
  }
  const tagged: StudyCard[] = [];
  for (const group of buckets.values()) {
    group.forEach((card, index) => {
      const level = LEVELS[Math.min(LEVELS.length - 1, Math.floor((index / group.length) * LEVELS.length))];
      tagged.push({ ...card, level });
    });
  }
  return tagged;
}

export const DECK: StudyCard[] = tagLevels([
  ...HOME_CARDS,
  ...CALENDAR_CARDS,
  ...VERB_CARDS,
  ...LEXICON_CARDS,
]);

export const TENSE_ORDER: TenseId[] = ["presente", "passato", "futuro"];

export const TENSE_LABEL: Record<TenseId, string> = {
  presente: "Presente",
  passato: "Passato prossimo",
  futuro: "Futuro semplice",
};
