import type { MotherTongue, StudyCard } from "../types";

const ESSERE = new Set([
  "essere", "andare", "venire", "uscire", "entrare", "tornare", "partire", "arrivare", "stare",
  "restare", "rimanere", "diventare", "nascere", "morire", "salire", "scendere", "cadere",
  "crescere", "piacere", "succedere", "sembrare",
]);

const PREPOSITIONS = new Set([
  "di", "a", "da", "in", "con", "su", "per", "tra", "fra", "sopra", "sotto", "dentro", "fuori",
  "davanti", "dietro", "senza", "verso", "contro", "durante", "secondo", "oltre", "presso",
  "circa", "tranne", "salvo", "mediante",
]);

const ADVERBS = new Set([
  "sopra", "sotto", "dentro", "fuori", "davanti", "dietro", "sempre", "mai", "spesso", "già",
  "ancora", "anche", "solo", "proprio", "molto", "poco", "bene", "male", "così", "qui", "qua",
  "lì", "là", "ora", "adesso", "prima", "dopo", "presto", "tardi", "insieme", "forse", "quasi",
  "più", "meno", "oggi", "ieri", "domani", "dove", "quando", "come", "perché",
]);

const IRREGULAR = new Set([
  "essere", "avere", "andare", "fare", "stare", "dare", "dire", "bere", "venire", "tenere",
  "salire", "uscire", "porre", "tradurre", "scegliere", "spegnere", "raccogliere", "cogliere",
  "piacere", "succedere", "rimanere", "morire", "dovere", "potere", "volere", "sapere",
  "vedere", "prendere", "mettere", "leggere", "scrivere", "vivere", "chiedere", "chiudere",
  "rispondere", "perdere", "correre", "conoscere", "crescere", "nascere",
]);

export function grammarLines(card: StudyCard, tongue: MotherTongue): string[] {
  const verb = infinitiveOf(card);
  if (verb) return verbLines(card, verb, tongue);
  const noun = nounLines(card.italian.trim(), tongue);
  if (noun) return noun;
  return otherLines(card.italian.trim(), tongue);
}

function infinitiveOf(card: StudyCard) {
  const candidates = [card.italian, card.topic, card.detail];
  return candidates.map((value) => value.trim().toLowerCase()).find((value) => isInfinitive(value)) ?? null;
}

function isInfinitive(word: string) {
  return /^(?:[a-zàèéìòù]*)(?:are|ere|ire|arsi|ersi|irsi)$/i.test(word);
}

function verbLines(card: StudyCard, infinitive: string, tongue: MotherTongue) {
  const reflexive = /(?:arsi|ersi|irsi)$/i.test(infinitive);
  const stemInfinitive = reflexive ? `${infinitive.slice(0, -2)}e` : infinitive;
  const ending = stemInfinitive.slice(-3).toLowerCase();
  const group = ending === "are" ? 1 : ending === "ere" ? 2 : 3;
  const groupLabel = group === 1 ? "1-ша" : group === 2 ? "2-га" : "3-тя";
  const auxiliary = reflexive || ESSERE.has(stemInfinitive) ? "essere" : "avere";
  const io = card.tenses?.presente?.io;
  const regular = io ? isRegularIo(stemInfinitive, io) : !IRREGULAR.has(stemInfinitive);
  const uk = tongue === "uk";
  const lines = [
    uk ? `${groupLabel} дієвідміна (-${ending}).` : `Conjugation ${group} (-${ending}).`,
    uk
      ? `${regular ? "Правильне" : "Неправильне"} дієслово.`
      : `${regular ? "Regular" : "Irregular"} verb.`,
    uk
      ? `Минулий час з допоміжним ${auxiliary}.`
      : `Past tense uses ${auxiliary}.`,
  ];
  if (io) lines.push(uk ? `1-ша особа однини: ${io}.` : `First person singular: ${io}.`);
  if (reflexive) lines.push(uk ? "Зворотне: частка si стоїть перед дієсловом." : "Reflexive: si comes before the verb.");
  return lines;
}

function isRegularIo(infinitive: string, io: string) {
  const stem = infinitive.slice(0, -3);
  const ending = infinitive.slice(-3);
  const form = io.toLowerCase();
  if (ending === "are") return form === `${stem}o`;
  if (ending === "ere") return form === `${stem}o`;
  return form === `${stem}o` || form === `${stem}isco`;
}

function nounLines(word: string, tongue: MotherTongue) {
  const match = word.match(/^(il|lo|la|i|gli|le|l')\s+(.+)$/i) ?? word.match(/^(l')(.+)$/i);
  if (!match) return null;
  const article = match[1].toLowerCase();
  const stem = match[2].trim();
  const uk = tongue === "uk";
  if (article === "il") {
    return [
      uk ? "Іменник чоловічого роду." : "Masculine noun.",
      uk ? "Артикль однини: il." : "Singular article: il.",
      uk ? `Множина: i ${pluralStem(stem, "m")}.` : `Plural: i ${pluralStem(stem, "m")}.`,
    ];
  }
  if (article === "lo") {
    return [
      uk ? "Іменник чоловічого роду." : "Masculine noun.",
      uk ? "Артикль однини: lo (перед s+приголосна, z, gn, ps, x, y)." : "Singular article: lo (before s+consonant, z, gn, ps, x, y).",
      uk ? `Множина: gli ${pluralStem(stem, "m")}.` : `Plural: gli ${pluralStem(stem, "m")}.`,
    ];
  }
  if (article === "la") {
    return [
      uk ? "Іменник жіночого роду." : "Feminine noun.",
      uk ? "Артикль однини: la." : "Singular article: la.",
      uk ? `Множина: le ${pluralStem(stem, "f")}.` : `Plural: le ${pluralStem(stem, "f")}.`,
    ];
  }
  if (article === "l'") {
    const feminine = /a$/i.test(stem);
    return feminine
      ? [
          uk ? "Іменник жіночого роду." : "Feminine noun.",
          uk ? "Артикль однини: l' перед голосною." : "Singular article: l' before a vowel.",
          uk ? `Множина: le ${pluralStem(stem, "f")}.` : `Plural: le ${pluralStem(stem, "f")}.`,
        ]
      : [
          uk ? "Іменник чоловічого роду." : "Masculine noun.",
          uk ? "Артикль однини: l' перед голосною." : "Singular article: l' before a vowel.",
          uk ? `Множина: gli ${pluralStem(stem, "m")}.` : `Plural: gli ${pluralStem(stem, "m")}.`,
        ];
  }
  if (article === "i" || article === "gli") {
    return [
      uk ? "Іменник чоловічого роду, форма множини." : "Masculine noun, plural form.",
      uk ? `Артикль множини: ${article}.` : `Plural article: ${article}.`,
      uk ? "Однина: il або lo, залежно від початку слова." : "Singular article is il or lo, depending on the first sounds.",
    ];
  }
  return [
    uk ? "Іменник жіночого роду, форма множини." : "Feminine noun, plural form.",
    uk ? "Артикль множини: le." : "Plural article: le.",
    uk ? "Однина: la або l'." : "Singular article is la or l'.",
  ];
}

function pluralStem(stem: string, gender: "m" | "f") {
  const lower = stem.toLowerCase();
  if (gender === "m") {
    if (/co$/i.test(lower)) return `${stem.slice(0, -2)}chi`;
    if (/go$/i.test(lower)) return `${stem.slice(0, -2)}ghi`;
    if (/io$/i.test(lower)) return stem.slice(0, -1);
    if (/o$/i.test(lower)) return `${stem.slice(0, -1)}i`;
    if (/e$/i.test(lower)) return `${stem.slice(0, -1)}i`;
    return stem;
  }
  if (/ca$/i.test(lower)) return `${stem.slice(0, -2)}che`;
  if (/ga$/i.test(lower)) return `${stem.slice(0, -2)}ghe`;
  if (/a$/i.test(lower)) return `${stem.slice(0, -1)}e`;
  if (/e$/i.test(lower)) return `${stem.slice(0, -1)}i`;
  return stem;
}

function otherLines(word: string, tongue: MotherTongue) {
  const bare = word.replace(/[?.!]+$/g, "").trim();
  const lower = bare.toLowerCase();
  const head = lower.split(/\s+/)[0] ?? lower;
  const uk = tongue === "uk";
  const invariable = uk ? "Незмінне слово: рід і число не змінюються." : "Invariable: it does not change for gender or number.";
  if (PREPOSITIONS.has(head) && bare.split(/\s+/).length === 1) {
    const kind = ADVERBS.has(head)
      ? uk ? "Частина мови: прийменник або прислівник." : "Part of speech: preposition or adverb."
      : uk ? "Частина мови: прийменник." : "Part of speech: preposition.";
    return [kind, invariable];
  }
  if (ADVERBS.has(head) || /mente$/i.test(head)) {
    return [
      uk ? "Частина мови: прислівник." : "Part of speech: adverb.",
      invariable,
    ];
  }
  const prep = lower.match(/^(di|a|da|in|su|per|con|tra|fra)\b/);
  if (prep) {
    return [
      uk ? "Частина мови: вираз." : "Part of speech: phrase.",
      uk ? `Керування: прийменник «${prep[1]}».` : `Government: the preposition “${prep[1]}”.`,
      invariable,
    ];
  }
  if (/o$/i.test(head) && bare.split(/\s+/).length === 1) {
    return [uk ? "Частина мови: прикметник. Закінчення -o: чоловічий -o, жіночий -a, множина -i / -e." : "Part of speech: adjective. Ending -o: masculine -o, feminine -a, plural -i / -e."];
  }
  if (/e$/i.test(head) && bare.split(/\s+/).length === 1) {
    return [uk ? "Частина мови: прикметник. Закінчення -e: одна форма для обох родів, множина на -i." : "Part of speech: adjective. Ending -e: one form for both genders, plural in -i."];
  }
  return [
    uk ? "Частина мови: вираз." : "Part of speech: phrase.",
    invariable,
  ];
}
