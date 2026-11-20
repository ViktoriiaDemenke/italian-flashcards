import type { MotherTongue, StudyCard } from "../types";

function pick(tongue: MotherTongue, text: Record<MotherTongue, string>) {
  return text[tongue];
}

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
  const group = ending === "are" ? 0 : ending === "ere" ? 1 : 2;
  const ordinals: Record<MotherTongue, string[]> = {
    en: ["1st", "2nd", "3rd"],
    uk: ["1-ша", "2-га", "3-тя"],
    ru: ["1-е", "2-е", "3-е"],
    de: ["1.", "2.", "3."],
    pl: ["1.", "2.", "3."],
    es: ["1.ª", "2.ª", "3.ª"],
    fr: ["1re", "2e", "3e"],
    ro: ["a 1-a", "a 2-a", "a 3-a"],
  };
  const groupLabel = ordinals[tongue][group];
  const auxiliary = reflexive || ESSERE.has(stemInfinitive) ? "essere" : "avere";
  const io = card.tenses?.presente?.io;
  const regular = io ? isRegularIo(stemInfinitive, io) : !IRREGULAR.has(stemInfinitive);
  const lines = [
    pick(tongue, {
      en: `Conjugation ${groupLabel} (-${ending}).`,
      uk: `${groupLabel} дієвідміна (-${ending}).`,
      ru: `${groupLabel} спряжение (-${ending}).`,
      de: `${groupLabel} Konjugation (-${ending}).`,
      pl: `${groupLabel} koniugacja (-${ending}).`,
      es: `${groupLabel} conjugación (-${ending}).`,
      fr: `${groupLabel} conjugaison (-${ending}).`,
      ro: `Conjugarea ${groupLabel} (-${ending}).`,
    }),
    regular
      ? pick(tongue, { en: "Regular verb.", uk: "Правильне дієслово.", ru: "Правильный глагол.", de: "Regelmäßiges Verb.", pl: "Czasownik regularny.", es: "Verbo regular.", fr: "Verbe régulier.", ro: "Verb regulat." })
      : pick(tongue, { en: "Irregular verb.", uk: "Неправильне дієслово.", ru: "Неправильный глагол.", de: "Unregelmäßiges Verb.", pl: "Czasownik nieregularny.", es: "Verbo irregular.", fr: "Verbe irrégulier.", ro: "Verb neregulat." }),
    pick(tongue, {
      en: `Past tense uses ${auxiliary}.`,
      uk: `Минулий час з допоміжним ${auxiliary}.`,
      ru: `Прошедшее время с вспомогательным ${auxiliary}.`,
      de: `Vergangenheit mit ${auxiliary}.`,
      pl: `Czas przeszły z ${auxiliary}.`,
      es: `El pasado usa ${auxiliary}.`,
      fr: `Le passé se forme avec ${auxiliary}.`,
      ro: `Trecutul folosește ${auxiliary}.`,
    }),
  ];
  if (io) {
    lines.push(pick(tongue, {
      en: `First person singular: ${io}.`,
      uk: `1-ша особа однини: ${io}.`,
      ru: `1-е лицо единственного числа: ${io}.`,
      de: `1. Person Singular: ${io}.`,
      pl: `1. osoba liczby pojedynczej: ${io}.`,
      es: `Primera persona del singular: ${io}.`,
      fr: `Première personne du singulier : ${io}.`,
      ro: `Persoana I singular: ${io}.`,
    }));
  }
  if (reflexive) {
    lines.push(pick(tongue, {
      en: "Reflexive: si comes before the verb.",
      uk: "Зворотне: частка si стоїть перед дієсловом.",
      ru: "Возвратное: частица si стоит перед глаголом.",
      de: "Reflexiv: si steht vor dem Verb.",
      pl: "Zwrotny: si stoi przed czasownikiem.",
      es: "Reflexivo: si va antes del verbo.",
      fr: "Réfléchi : si se place avant le verbe.",
      ro: "Reflexiv: si stă înaintea verbului.",
    }));
  }
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
  const masculine = pick(tongue, { en: "Masculine noun.", uk: "Іменник чоловічого роду.", ru: "Существительное мужского рода.", de: "Maskulines Substantiv.", pl: "Rzeczownik rodzaju męskiego.", es: "Sustantivo masculino.", fr: "Nom masculin.", ro: "Substantiv masculin." });
  const feminine = pick(tongue, { en: "Feminine noun.", uk: "Іменник жіночого роду.", ru: "Существительное женского рода.", de: "Feminines Substantiv.", pl: "Rzeczownik rodzaju żeńskiego.", es: "Sustantivo femenino.", fr: "Nom féminin.", ro: "Substantiv feminin." });
  const singular = (articleName: string) => pick(tongue, { en: `Singular article: ${articleName}.`, uk: `Артикль однини: ${articleName}.`, ru: `Артикль единственного числа: ${articleName}.`, de: `Artikel Singular: ${articleName}.`, pl: `Rodzajnik liczby pojedynczej: ${articleName}.`, es: `Artículo singular: ${articleName}.`, fr: `Article singulier : ${articleName}.`, ro: `Articol singular: ${articleName}.` });
  const plural = (form: string) => pick(tongue, { en: `Plural: ${form}.`, uk: `Множина: ${form}.`, ru: `Множественное число: ${form}.`, de: `Plural: ${form}.`, pl: `Liczba mnoga: ${form}.`, es: `Plural: ${form}.`, fr: `Pluriel : ${form}.`, ro: `Plural: ${form}.` });
  if (article === "il") {
    return [masculine, singular("il"), plural(`i ${pluralStem(stem, "m")}`)];
  }
  if (article === "lo") {
    return [
      masculine,
      pick(tongue, {
        en: "Singular article: lo (before s+consonant, z, gn, ps, x, y).",
        uk: "Артикль однини: lo (перед s+приголосна, z, gn, ps, x, y).",
        ru: "Артикль единственного числа: lo (перед s+согласная, z, gn, ps, x, y).",
        de: "Artikel Singular: lo (vor s+Konsonant, z, gn, ps, x, y).",
        pl: "Rodzajnik liczby pojedynczej: lo (przed s+spółgłoska, z, gn, ps, x, y).",
        es: "Artículo singular: lo (ante s+consonante, z, gn, ps, x, y).",
        fr: "Article singulier : lo (devant s+consonne, z, gn, ps, x, y).",
        ro: "Articol singular: lo (înainte de s+consoană, z, gn, ps, x, y).",
      }),
      plural(`gli ${pluralStem(stem, "m")}`),
    ];
  }
  if (article === "la") {
    return [feminine, singular("la"), plural(`le ${pluralStem(stem, "f")}`)];
  }
  if (article === "l'") {
    const feminineNoun = /a$/i.test(stem);
    const elided = pick(tongue, {
      en: "Singular article: l' before a vowel.",
      uk: "Артикль однини: l' перед голосною.",
      ru: "Артикль единственного числа: l' перед гласной.",
      de: "Artikel Singular: l' vor einem Vokal.",
      pl: "Rodzajnik liczby pojedynczej: l' przed samogłoską.",
      es: "Artículo singular: l' ante vocal.",
      fr: "Article singulier : l' devant une voyelle.",
      ro: "Articol singular: l' înaintea unei vocale.",
    });
    return feminineNoun
      ? [feminine, elided, plural(`le ${pluralStem(stem, "f")}`)]
      : [masculine, elided, plural(`gli ${pluralStem(stem, "m")}`)];
  }
  if (article === "i" || article === "gli") {
    return [
      pick(tongue, { en: "Masculine noun, plural form.", uk: "Іменник чоловічого роду, форма множини.", ru: "Существительное мужского рода, форма множественного числа.", de: "Maskulines Substantiv, Pluralform.", pl: "Rzeczownik męski, forma liczby mnogiej.", es: "Sustantivo masculino, forma plural.", fr: "Nom masculin, forme plurielle.", ro: "Substantiv masculin, formă de plural." }),
      pick(tongue, { en: `Plural article: ${article}.`, uk: `Артикль множини: ${article}.`, ru: `Артикль множественного числа: ${article}.`, de: `Artikel Plural: ${article}.`, pl: `Rodzajnik liczby mnogiej: ${article}.`, es: `Artículo plural: ${article}.`, fr: `Article pluriel : ${article}.`, ro: `Articol plural: ${article}.` }),
      pick(tongue, { en: "Singular article is il or lo, depending on the first sounds.", uk: "Однина: il або lo, залежно від початку слова.", ru: "Единственное число: il или lo, в зависимости от начала слова.", de: "Singular: il oder lo, je nach Wortanfang.", pl: "Liczba pojedyncza: il albo lo, zależnie od początku słowa.", es: "El singular es il o lo, según el inicio de la palabra.", fr: "Le singulier est il ou lo, selon le début du mot.", ro: "Singularul este il sau lo, după începutul cuvântului." }),
    ];
  }
  return [
    pick(tongue, { en: "Feminine noun, plural form.", uk: "Іменник жіночого роду, форма множини.", ru: "Существительное женского рода, форма множественного числа.", de: "Feminines Substantiv, Pluralform.", pl: "Rzeczownik żeński, forma liczby mnogiej.", es: "Sustantivo femenino, forma plural.", fr: "Nom féminin, forme plurielle.", ro: "Substantiv feminin, formă de plural." }),
    pick(tongue, { en: "Plural article: le.", uk: "Артикль множини: le.", ru: "Артикль множественного числа: le.", de: "Artikel Plural: le.", pl: "Rodzajnik liczby mnogiej: le.", es: "Artículo plural: le.", fr: "Article pluriel : le.", ro: "Articol plural: le." }),
    pick(tongue, { en: "Singular article is la or l'.", uk: "Однина: la або l'.", ru: "Единственное число: la или l'.", de: "Singular: la oder l'.", pl: "Liczba pojedyncza: la albo l'.", es: "El singular es la o l'.", fr: "Le singulier est la ou l'.", ro: "Singularul este la sau l'." }),
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
  const invariable = pick(tongue, { en: "Invariable: it does not change for gender or number.", uk: "Незмінне слово: рід і число не змінюються.", ru: "Неизменяемое слово: род и число не меняются.", de: "Unveränderlich: kein Genus, kein Numerus.", pl: "Nieodmienne: rodzaj i liczba się nie zmieniają.", es: "Invariable: no cambia de género ni de número.", fr: "Invariable : ni genre ni nombre.", ro: "Invariabil: nu se schimbă după gen sau număr." });
  if (PREPOSITIONS.has(head) && bare.split(/\s+/).length === 1) {
    const kind = ADVERBS.has(head)
      ? pick(tongue, { en: "Part of speech: preposition or adverb.", uk: "Частина мови: прийменник або прислівник.", ru: "Часть речи: предлог или наречие.", de: "Wortart: Präposition oder Adverb.", pl: "Część mowy: przyimek albo przysłówek.", es: "Categoría: preposición o adverbio.", fr: "Nature : préposition ou adverbe.", ro: "Parte de vorbire: prepoziție sau adverb." })
      : pick(tongue, { en: "Part of speech: preposition.", uk: "Частина мови: прийменник.", ru: "Часть речи: предлог.", de: "Wortart: Präposition.", pl: "Część mowy: przyimek.", es: "Categoría: preposición.", fr: "Nature : préposition.", ro: "Parte de vorbire: prepoziție." });
    return [kind, invariable];
  }
  if (ADVERBS.has(head) || /mente$/i.test(head)) {
    return [
      pick(tongue, { en: "Part of speech: adverb.", uk: "Частина мови: прислівник.", ru: "Часть речи: наречие.", de: "Wortart: Adverb.", pl: "Część mowy: przysłówek.", es: "Categoría: adverbio.", fr: "Nature : adverbe.", ro: "Parte de vorbire: adverb." }),
      invariable,
    ];
  }
  const prep = lower.match(/^(di|a|da|in|su|per|con|tra|fra)\b/);
  if (prep) {
    return [
      pick(tongue, { en: "Part of speech: phrase.", uk: "Частина мови: вираз.", ru: "Часть речи: выражение.", de: "Wortart: Ausdruck.", pl: "Część mowy: wyrażenie.", es: "Categoría: expresión.", fr: "Nature : expression.", ro: "Parte de vorbire: expresie." }),
      pick(tongue, { en: `Government: the preposition “${prep[1]}”.`, uk: `Керування: прийменник «${prep[1]}».`, ru: `Управление: предлог «${prep[1]}».`, de: `Rektion: Präposition „${prep[1]}“.`, pl: `Rekcja: przyimek „${prep[1]}”.`, es: `Régimen: preposición “${prep[1]}”.`, fr: `Régime : préposition « ${prep[1]} ».`, ro: `Regim: prepoziția „${prep[1]}”.` }),
      invariable,
    ];
  }
  if (/o$/i.test(head) && bare.split(/\s+/).length === 1) {
    return [pick(tongue, { en: "Part of speech: adjective. Ending -o: masculine -o, feminine -a, plural -i / -e.", uk: "Частина мови: прикметник. Закінчення -o: чоловічий -o, жіночий -a, множина -i / -e.", ru: "Часть речи: прилагательное. Окончание -o: мужской -o, женский -a, множественное -i / -e.", de: "Wortart: Adjektiv. Endung -o: maskulin -o, feminin -a, Plural -i / -e.", pl: "Część mowy: przymiotnik. Końcówka -o: męski -o, żeński -a, liczba mnoga -i / -e.", es: "Categoría: adjetivo. Terminación -o: masculino -o, femenino -a, plural -i / -e.", fr: "Nature : adjectif. Terminaison -o : masculin -o, féminin -a, pluriel -i / -e.", ro: "Parte de vorbire: adjectiv. Terminația -o: masculin -o, feminin -a, plural -i / -e." })];
  }
  if (/e$/i.test(head) && bare.split(/\s+/).length === 1) {
    return [pick(tongue, { en: "Part of speech: adjective. Ending -e: one form for both genders, plural in -i.", uk: "Частина мови: прикметник. Закінчення -e: одна форма для обох родів, множина на -i.", ru: "Часть речи: прилагательное. Окончание -e: одна форма для обоих родов, множественное на -i.", de: "Wortart: Adjektiv. Endung -e: eine Form für beide Genera, Plural auf -i.", pl: "Część mowy: przymiotnik. Końcówka -e: jedna forma dla obu rodzajów, liczba mnoga na -i.", es: "Categoría: adjetivo. Terminación -e: una forma para ambos géneros, plural en -i.", fr: "Nature : adjectif. Terminaison -e : une forme pour les deux genres, pluriel en -i.", ro: "Parte de vorbire: adjectiv. Terminația -e: o formă pentru ambele genuri, plural în -i." })];
  }
  return [
    pick(tongue, { en: "Part of speech: phrase.", uk: "Частина мови: вираз.", ru: "Часть речи: выражение.", de: "Wortart: Ausdruck.", pl: "Część mowy: wyrażenie.", es: "Categoría: expresión.", fr: "Nature : expression.", ro: "Parte de vorbire: expresie." }),
    invariable,
  ];
}
