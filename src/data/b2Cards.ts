import rows from "./b2-cards-6-10.json" with { type: "json" };
import type { CategoryId, LangText, MotherTongue, StudyCard, TopicId } from "../types";

const TONGUES: MotherTongue[] = ["en", "uk", "ru", "de", "pl", "es", "fr", "ro"];

function langText(source: Record<string, string>): LangText {
  return {
    en: source.en,
    uk: source.uk,
    ru: source.ru,
    de: source.de,
    pl: source.pl,
    es: source.es,
    fr: source.fr,
    ro: source.ro,
  };
}

export const B2_EXTRA: StudyCard[] = rows.map((row) => {
  const translation = langText(row.translations);
  const exampleTranslation = langText(
    Object.fromEntries(TONGUES.map((tongue) => [tongue, row.examples[tongue].translation])),
  );
  return {
    id: row.id,
    category: row.topic as CategoryId,
    topic: row.topic as TopicId,
    level: "B2",
    italian: row.word,
    kind: "vocab" as const,
    detail: row.word,
    example: row.examples.en.sentence,
    exampleTranslation,
    translation,
    gloss: translation,
  };
});
