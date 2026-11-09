export type Level = "A1" | "A2" | "B1" | "B2";

export type CategoryId = "home" | "calendar" | "verbs" | "nouns" | "adjectives" | "idioms";

export type FilterId = "quick" | CategoryId;

export type TopicId =
  | "living"
  | "bath"
  | "bedroom"
  | "kitchen"
  | "kids"
  | "furniture"
  | "appliances"
  | "weekdays"
  | "months"
  | "seasons"
  | "cardinals"
  | "ordinals"
  | "time"
  | "essere"
  | "avere"
  | "andare"
  | "fare"
  | "potere"
  | "volere"
  | "dovere"
  | "nouns"
  | "adjectives"
  | "idioms";

export type StudyMode = "cards" | "quiz";

export type MotherTongue = "en" | "uk" | "ru" | "de" | "pl" | "es" | "fr" | "ro";

export type SourceLang = MotherTongue;

export type TenseId = "presente" | "passato" | "futuro";

export type GradeId = "again" | "hard" | "good" | "easy";

export type Person = "io" | "tu" | "lui" | "noi" | "voi" | "loro";

export type Conjugation = Record<Person, string>;

export type LangText = Record<MotherTongue, string>;

export type StudyCard = {
  id: string;
  category: CategoryId;
  topic: TopicId;
  level: Level;
  italian: string;
  kind: "verb" | "vocab";
  detail: string;
  example?: string;
  exampleTranslation?: LangText;
  tenses?: Partial<Record<TenseId, Conjugation>>;
  translation: LangText;
  gloss: LangText;
};
