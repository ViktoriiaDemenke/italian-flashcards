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

export const SOURCE_OPTIONS: { id: SourceLang; flag: string; label: string }[] = [
  { id: "en-GB", flag: "🇬🇧", label: "English" },
  { id: "en-US", flag: "🇺🇸", label: "EN (US)" },
  { id: "es", flag: "🇪🇸", label: "ES" },
  { id: "fr", flag: "🇫🇷", label: "FR" },
  { id: "ro", flag: "🇷🇴", label: "RO" },
];

export const LEVELS = [
  { id: "A1" as const, name: "Beginner" },
  { id: "A2" as const, name: "Elementary" },
  { id: "B1" as const, name: "Intermediate" },
  { id: "B2" as const, name: "Advanced" },
];
