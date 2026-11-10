export type Level = "A1" | "A2" | "B1" | "B2";

export type CategoryId =
  | "home"
  | "calendar"
  | "numbers"
  | "tempo_calendario"
  | "verbs"
  | "city"
  | "transport"
  | "shopping"
  | "clothes"
  | "health"
  | "bureaucracy"
  | "work"
  | "emotions"
  | "environment"
  | "technology"
  | "rent"
  | "slang"
  | "society"
  | "social"
  | "finance"
  | "tempo"
  | "casa"
  | "numeri"
  | "corpo"
  | "famiglia"
  | "direzione"
  | "cibo"
  | "vestiti"
  | "trasporti"
  | "verbi"
  | "nouns"
  | "adjectives"
  | "idioms";

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
  | "tempo_calendario"
  | "ordinals"
  | "time"
  | "essere"
  | "avere"
  | "andare"
  | "fare"
  | "potere"
  | "volere"
  | "dovere"
  | "city"
  | "transport"
  | "shopping"
  | "clothes"
  | "health"
  | "bureaucracy"
  | "work"
  | "emotions"
  | "environment"
  | "technology"
  | "character"
  | "documents"
  | "repairs"
  | "slang"
  | "society"
  | "social"
  | "finance"
  | "tempo"
  | "casa"
  | "numeri"
  | "corpo"
  | "famiglia"
  | "direzione"
  | "cibo"
  | "vestiti"
  | "trasporti"
  | "verbi"
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
