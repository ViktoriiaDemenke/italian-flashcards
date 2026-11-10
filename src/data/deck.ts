import { A2_CARDS } from "./a2Cards";
import { A1_EXTRA } from "./a1Sets";
import { ADVANCED_DECKS } from "./advancedDecks";
import { CALENDAR_CARDS } from "./calendarCards";
import { HOME_CARDS } from "./homeCards";
import { LEXICON_CARDS } from "./lexiconCards";
import { TEMPO_CARDS } from "./tempoCards";
import { VERB_CARDS } from "./verbCards";
import type { CategoryId, FilterId, Level, StudyCard, TenseId, TopicId } from "../types";

const A1_HOME = new Set<TopicId>(["living", "bath", "bedroom", "kitchen", "kids", "furniture"]);
const A1_VERBS = new Set<TopicId>(["essere", "avere", "andare", "fare", "potere", "volere", "dovere"]);

const A1_DECK: StudyCard[] = [
  ...TEMPO_CARDS,
  ...A1_EXTRA.filter((card) => card.category === "tempo"),
  ...HOME_CARDS.filter((card) => A1_HOME.has(card.topic)).map((card) => ({
    ...card,
    level: "A1" as const,
    category: "casa" as const,
    topic: "casa" as const,
  })),
  ...CALENDAR_CARDS.filter((card) => card.topic === "cardinals").map((card) => ({
    ...card,
    level: "A1" as const,
    category: "numeri" as const,
    topic: "numeri" as const,
  })),
  ...A1_EXTRA.filter((card) => card.category !== "tempo"),
  ...VERB_CARDS.filter((card) => A1_VERBS.has(card.topic)).map((card) => ({
    ...card,
    level: "A1" as const,
    category: "verbi" as const,
  })),
];

const A2_DECK = A2_CARDS;

const B2_IDIOMS = LEXICON_CARDS.filter((card) => card.category === "idioms").map((card) => ({
  ...card,
  level: "B2" as const,
}));

export const DECK: StudyCard[] = [...A1_DECK, ...A2_DECK, ...ADVANCED_DECKS, ...B2_IDIOMS];

const CATEGORY_ORDER: CategoryId[] = [
  "tempo",
  "casa",
  "numeri",
  "corpo",
  "famiglia",
  "direzione",
  "cibo",
  "vestiti",
  "trasporti",
  "verbi",
  "mobili_pulizia",
  "meteo_stagioni",
  "numeri_ordinali",
  "salute_farmacia",
  "relazioni_carattere",
  "mobilita_urbana",
  "ristorante_cucina",
  "shopping_taglie",
  "professioni_lavoro",
  "viaggi_hotel",
  "home",
  "numbers",
  "verbs",
  "city",
  "transport",
  "shopping",
  "clothes",
  "health",
  "emotions",
  "bureaucracy",
  "rent",
  "slang",
  "society",
  "social",
  "finance",
  "idioms",
];

export function cardsFor(level: Level, filter: FilterId, topic: TopicId | null): StudyCard[] {
  return DECK.filter((card) => {
    if (card.level !== level) return false;
    if (filter === "quick") return true;
    if (card.category !== filter) return false;
    if (topic && card.topic !== topic) return false;
    return true;
  });
}

export function topicsOnLevel(level: Level): { category: CategoryId; topic: TopicId }[] {
  const seen = new Set<string>();
  const topics: { category: CategoryId; topic: TopicId }[] = [];
  for (const card of DECK) {
    if (card.level !== level) continue;
    const key = `${card.category}:${card.topic}`;
    if (seen.has(key)) continue;
    seen.add(key);
    topics.push({ category: card.category, topic: card.topic });
  }
  return topics.sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category));
}

export function selectionForLevel(level: Level): { filter: FilterId; topic: TopicId | null } {
  const first = topicsOnLevel(level)[0];
  if (!first) return { filter: "quick", topic: null };
  return { filter: first.category, topic: first.topic };
}

export const TENSE_ORDER: TenseId[] = ["presente", "passato", "futuro"];

export const TENSE_LABEL: Record<TenseId, string> = {
  presente: "Presente",
  passato: "Passato prossimo",
  futuro: "Futuro semplice",
};
