import type { MotherTongue, StudyCard } from "../types";

export function translationOf(card: StudyCard, lang: MotherTongue) {
  return card.translation[lang];
}

export function exampleTranslationOf(card: StudyCard, lang: MotherTongue) {
  return card.exampleTranslation?.[lang];
}

export const LEVELS = [
  { id: "A1" as const, nameKey: "beginner" as const },
  { id: "A2" as const, nameKey: "elementary" as const },
  { id: "B1" as const, nameKey: "intermediate" as const },
  { id: "B2" as const, nameKey: "advanced" as const },
];
