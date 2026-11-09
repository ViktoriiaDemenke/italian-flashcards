import type { CategoryId, Conjugation, StudyCard, TenseId, TopicId } from "../types";

export type Eight = [string, string, string, string, string, string, string, string];

export function text(parts: Eight) {
  const [en, uk, ru, de, pl, es, fr, ro] = parts;
  return { en, uk, ru, de, pl, es, fr, ro };
}

export function vocab(
  id: string,
  category: CategoryId,
  topic: TopicId,
  italian: string,
  example: string,
  word: Eight,
  ex: Eight,
): StudyCard {
  return {
    id,
    category,
    topic,
    level: "A1",
    italian,
    kind: "vocab",
    detail: italian,
    example,
    translation: text(word),
    exampleTranslation: text(ex),
    gloss: text(word),
  };
}

export function present(
  io: string,
  tu: string,
  lui: string,
  noi: string,
  voi: string,
  loro: string,
): Partial<Record<TenseId, Conjugation>> {
  return { presente: { io, tu, lui, noi, voi, loro } };
}

export function verbCard(
  id: string,
  topic: TopicId,
  italian: string,
  example: string,
  word: Eight,
  ex: Eight,
  tenses: Partial<Record<TenseId, Conjugation>>,
): StudyCard {
  return {
    ...vocab(id, "verbs", topic, italian, example, word, ex),
    kind: "verb",
    tenses,
  };
}
