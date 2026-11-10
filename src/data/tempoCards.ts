import rows from "./a1-tempo.json" with { type: "json" };
import type { LangText, MotherTongue, StudyCard } from "../types";

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

export const TEMPO_CARDS: StudyCard[] = rows.map((row) => {
  const translation = langText(row.translations);
  const exampleTranslation = langText(
    Object.fromEntries(TONGUES.map((tongue) => [tongue, row.examples[tongue].translation])),
  );
  return {
    id: row.id,
    category: "tempo_calendario",
    topic: "tempo_calendario",
    level: "A1",
    italian: row.word,
    kind: "vocab",
    detail: row.word,
    example: row.examples.uk.sentence,
    exampleTranslation,
    translation,
    gloss: translation,
  };
});
