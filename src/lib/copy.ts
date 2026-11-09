import type { LangText, SourceLang, StudyCard } from "../types";

export function langKey(lang: SourceLang): keyof LangText {
  if (lang === "en-GB" || lang === "en-US") return "en";
  return lang;
}

export function translationOf(card: StudyCard, lang: SourceLang) {
  if (lang === "en-US" && card.enUS?.translation) return card.enUS.translation;
  return card.translation[langKey(lang)];
}

export function glossOf(card: StudyCard, lang: SourceLang) {
  if (lang === "en-US" && card.enUS?.gloss) return card.enUS.gloss;
  return card.gloss[langKey(lang)];
}

export function exampleTranslationOf(card: StudyCard, lang: SourceLang) {
  if (!card.exampleTranslation) return undefined;
  return card.exampleTranslation[langKey(lang)];
}

export const SOURCE_OPTIONS: { id: SourceLang; code: string; label: string }[] = [
  { id: "en-US", code: "EN", label: "English" },
  { id: "en-GB", code: "UK", label: "English (UK)" },
  { id: "es", code: "ES", label: "Español" },
  { id: "fr", code: "FR", label: "Français" },
  { id: "ro", code: "RO", label: "Română" },
];

export function sourceName(lang: SourceLang) {
  return SOURCE_OPTIONS.find((option) => option.id === lang)?.label ?? "English";
}

export const LEVELS = [
  { id: "A1" as const, name: "Beginner" },
  { id: "A2" as const, name: "Elementary" },
  { id: "B1" as const, name: "Intermediate" },
  { id: "B2" as const, name: "Advanced" },
];
