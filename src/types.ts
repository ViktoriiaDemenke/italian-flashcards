export type Level = "A1" | "A2" | "B1" | "B2";

export type CategoryId = "household" | "calendar" | "ordinals" | "verbs";

export type FilterId = "quick" | CategoryId;

export type SourceLang = "en-GB" | "en-US" | "es" | "fr" | "ro";

export type TenseId = "presente" | "passato" | "futuro";

export type GradeId = "again" | "hard" | "good" | "easy";

export type Person = "io" | "tu" | "lui" | "noi" | "voi" | "loro";

export type Conjugation = Record<Person, string>;

export type LangText = {
  en: string;
  es: string;
  fr: string;
  ro: string;
};

export type StudyCard = {
  id: string;
  category: CategoryId;
  level: Level;
  italian: string;
  kind: "verb" | "vocab";
  detail: string;
  example?: string;
  tenses?: Partial<Record<TenseId, Conjugation>>;
  translation: LangText;
  gloss: LangText;
  enUS?: { translation?: string; gloss?: string };
};
