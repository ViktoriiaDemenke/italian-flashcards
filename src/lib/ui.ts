import type { MotherTongue } from "../types";

export const TONGUES: {
  id: MotherTongue;
  code: string;
  flag: string;
  name: string;
}[] = [
  { id: "en", code: "EN", flag: "🇬🇧", name: "English" },
  { id: "uk", code: "UK", flag: "🇺🇦", name: "Українська" },
  { id: "ru", code: "RU", flag: "🇷🇺", name: "Русский" },
  { id: "de", code: "DE", flag: "🇩🇪", name: "Deutsch" },
  { id: "pl", code: "PL", flag: "🇵🇱", name: "Polski" },
  { id: "es", code: "ES", flag: "🇪🇸", name: "Español" },
  { id: "fr", code: "FR", flag: "🇫🇷", name: "Français" },
  { id: "ro", code: "RO", flag: "🇷🇴", name: "Română" },
];

export type UiKey =
  | "streak"
  | "cardsToday"
  | "beginner"
  | "elementary"
  | "intermediate"
  | "advanced"
  | "quick"
  | "household"
  | "calendar"
  | "ordinals"
  | "verbs"
  | "mixed"
  | "days"
  | "months"
  | "moments"
  | "early"
  | "later"
  | "aux"
  | "motion"
  | "daily"
  | "flashcards"
  | "quiz"
  | "cardOf"
  | "reveal"
  | "hide"
  | "again"
  | "hard"
  | "good"
  | "easy"
  | "min"
  | "day"
  | "days3"
  | "days7"
  | "revealToGrade"
  | "session"
  | "complete"
  | "empty"
  | "graded"
  | "keep"
  | "againBtn"
  | "stats"
  | "mastered"
  | "repeat"
  | "accuracy"
  | "mother"
  | "means"
  | "speak";

const UI: Record<UiKey, Record<MotherTongue, string>> = {
  streak: {
    en: "Day Streak",
    uk: "днів поспіль",
    ru: "дней подряд",
    de: "Tage-Serie",
    pl: "dni z rzędu",
    es: "días seguidos",
    fr: "jours d'affilée",
    ro: "zile la rând",
  },
  cardsToday: {
    en: "Cards today",
    uk: "Карток сьогодні",
    ru: "Карточек сегодня",
    de: "Karten heute",
    pl: "Karty dziś",
    es: "Tarjetas hoy",
    fr: "Cartes aujourd'hui",
    ro: "Carduri azi",
  },
  beginner: { en: "Beginner", uk: "Початковий", ru: "Начальный", de: "Anfänger", pl: "Początkujący", es: "Principiante", fr: "Débutant", ro: "Începător" },
  elementary: { en: "Elementary", uk: "Елементарний", ru: "Элементарный", de: "Grundstufe", pl: "Podstawowy", es: "Elemental", fr: "Élémentaire", ro: "Elementar" },
  intermediate: { en: "Intermediate", uk: "Середній", ru: "Средний", de: "Mittelstufe", pl: "Średni", es: "Intermedio", fr: "Intermédiaire", ro: "Intermediar" },
  advanced: { en: "Advanced", uk: "Просунутий", ru: "Продвинутый", de: "Fortgeschritten", pl: "Zaawansowany", es: "Avanzado", fr: "Avancé", ro: "Avansat" },
  quick: { en: "Quick Review", uk: "Швидке повторення", ru: "Быстрое повторение", de: "Schnellwiederholung", pl: "Szybka powtórka", es: "Repaso rápido", fr: "Révision rapide", ro: "Recapitulare rapidă" },
  household: { en: "Casa & Household", uk: "Casa і дім", ru: "Casa и дом", de: "Casa & Haushalt", pl: "Casa i dom", es: "Casa y hogar", fr: "Casa et maison", ro: "Casa și casa" },
  calendar: { en: "Calendar & Time", uk: "Календар і час", ru: "Календарь и время", de: "Kalender & Zeit", pl: "Kalendarz i czas", es: "Calendario y tiempo", fr: "Calendrier et temps", ro: "Calendar și timp" },
  ordinals: { en: "Ordinal Numbers", uk: "Порядкові числівники", ru: "Порядковые числительные", de: "Ordnungszahlen", pl: "Liczebniki porządkowe", es: "Números ordinales", fr: "Nombres ordinaux", ro: "Numerale ordinale" },
  verbs: { en: "Essential Verbs", uk: "Основні дієслова", ru: "Основные глаголы", de: "Wichtige Verben", pl: "Podstawowe czasowniki", es: "Verbos esenciales", fr: "Verbes essentiels", ro: "Verbe esențiale" },
  mixed: { en: "Mixed mode", uk: "Змішаний режим", ru: "Смешанный режим", de: "Gemischt", pl: "Tryb mieszany", es: "Modo mixto", fr: "Mode mixte", ro: "Mod mixt" },
  days: { en: "Days", uk: "Дні", ru: "Дни", de: "Tage", pl: "Dni", es: "Días", fr: "Jours", ro: "Zile" },
  months: { en: "Months & year", uk: "Місяці й рік", ru: "Месяцы и год", de: "Monate & Jahr", pl: "Miesiące i rok", es: "Meses y año", fr: "Mois et année", ro: "Luni și an" },
  moments: { en: "Moments", uk: "Моменти", ru: "Моменты", de: "Zeitpunkte", pl: "Chwile", es: "Momentos", fr: "Moments", ro: "Momente" },
  early: { en: "1st–5th", uk: "1-й–5-й", ru: "1-й–5-й", de: "1.–5.", pl: "1.–5.", es: "1.º–5.º", fr: "1er–5e", ro: "1–5" },
  later: { en: "6th–10th", uk: "6-й–10-й", ru: "6-й–10-й", de: "6.–10.", pl: "6.–10.", es: "6.º–10.º", fr: "6e–10e", ro: "6–10" },
  aux: { en: "Auxiliaries", uk: "Допоміжні", ru: "Вспомогательные", de: "Hilfsverben", pl: "Posiłkowe", es: "Auxiliares", fr: "Auxiliaires", ro: "Auxiliare" },
  motion: { en: "Motion", uk: "Рух", ru: "Движение", de: "Bewegung", pl: "Ruch", es: "Movimiento", fr: "Mouvement", ro: "Mișcare" },
  daily: { en: "Everyday", uk: "Щоденні", ru: "Повседневные", de: "Alltag", pl: "Codzienne", es: "Cotidiano", fr: "Quotidien", ro: "De zi cu zi" },
  flashcards: { en: "Flashcards", uk: "Картки", ru: "Карточки", de: "Karteikarten", pl: "Fiszki", es: "Tarjetas", fr: "Cartes", ro: "Carduri" },
  quiz: { en: "Quiz Mode", uk: "Режим тесту", ru: "Режим теста", de: "Quizmodus", pl: "Tryb quizu", es: "Modo quiz", fr: "Mode quiz", ro: "Mod quiz" },
  cardOf: { en: "CARD {n} OF {total}", uk: "КАРТКА {n} З {total}", ru: "КАРТОЧКА {n} ИЗ {total}", de: "KARTE {n} VON {total}", pl: "KARTA {n} Z {total}", es: "TARJETA {n} DE {total}", fr: "CARTE {n} SUR {total}", ro: "CARDUL {n} DIN {total}" },
  reveal: { en: "Click to reveal the translation", uk: "Натисніть, щоб побачити переклад", ru: "Нажмите, чтобы увидеть перевод", de: "Klicken, um die Übersetzung zu sehen", pl: "Kliknij, aby zobaczyć tłumaczenie", es: "Clic para ver la traducción", fr: "Cliquez pour voir la traduction", ro: "Clic pentru traducere" },
  hide: { en: "Click to return to Italian", uk: "Натисніть, щоб повернутись до італійської", ru: "Нажмите, чтобы вернуться к итальянскому", de: "Klicken, um zum Italienischen zurückzukehren", pl: "Kliknij, aby wrócić do włoskiego", es: "Clic para volver al italiano", fr: "Cliquez pour revenir à l'italien", ro: "Clic pentru a reveni la italiană" },
  again: { en: "Again", uk: "Знову", ru: "Снова", de: "Nochmal", pl: "Znów", es: "Otra vez", fr: "Encore", ro: "Din nou" },
  hard: { en: "Hard", uk: "Важко", ru: "Трудно", de: "Schwer", pl: "Trudne", es: "Difícil", fr: "Difficile", ro: "Greu" },
  good: { en: "Good", uk: "Добре", ru: "Хорошо", de: "Gut", pl: "Dobrze", es: "Bien", fr: "Bien", ro: "Bine" },
  easy: { en: "Easy", uk: "Легко", ru: "Легко", de: "Leicht", pl: "Łatwo", es: "Fácil", fr: "Facile", ro: "Ușor" },
  min: { en: "< 1 MIN", uk: "< 1 ХВ", ru: "< 1 МИН", de: "< 1 MIN", pl: "< 1 MIN", es: "< 1 MIN", fr: "< 1 MIN", ro: "< 1 MIN" },
  day: { en: "1 DAY", uk: "1 ДЕНЬ", ru: "1 ДЕНЬ", de: "1 TAG", pl: "1 DZIEŃ", es: "1 DÍA", fr: "1 JOUR", ro: "1 ZI" },
  days3: { en: "3 DAYS", uk: "3 ДНІ", ru: "3 ДНЯ", de: "3 TAGE", pl: "3 DNI", es: "3 DÍAS", fr: "3 JOURS", ro: "3 ZILE" },
  days7: { en: "7 DAYS", uk: "7 ДНІВ", ru: "7 ДНЕЙ", de: "7 TAGE", pl: "7 DNI", es: "7 DÍAS", fr: "7 JOURS", ro: "7 ZILE" },
  revealToGrade: { en: "Reveal the card to grade your recall", uk: "Відкрийте картку, щоб оцінити пам'ять", ru: "Откройте карточку, чтобы оценить ответ", de: "Karte aufdecken, um die Antwort zu bewerten", pl: "Odkryj kartę, aby ocenić odpowiedź", es: "Revela la tarjeta para evaluar", fr: "Retournez la carte pour noter", ro: "Descoperă cardul ca să evaluezi" },
  session: { en: "SESSION", uk: "СЕСІЯ", ru: "СЕССИЯ", de: "SITZUNG", pl: "SESJA", es: "SESIÓN", fr: "SESSION", ro: "SESIUNE" },
  complete: { en: "Session complete", uk: "Сесію завершено", ru: "Сессия завершена", de: "Sitzung beendet", pl: "Sesja ukończona", es: "Sesión completa", fr: "Session terminée", ro: "Sesiune completă" },
  empty: { en: "No cards at this level", uk: "Немає карток на цьому рівні", ru: "Нет карточек на этом уровне", de: "Keine Karten auf dieser Stufe", pl: "Brak kart na tym poziomie", es: "No hay tarjetas en este nivel", fr: "Aucune carte à ce niveau", ro: "Nu sunt carduri la acest nivel" },
  graded: { en: "You graded {n} cards in this pass. Accuracy is {p}%.", uk: "Ви оцінили {n} карток. Точність {p}%.", ru: "Вы оценили {n} карточек. Точность {p}%.", de: "Du hast {n} Karten bewertet. Genauigkeit {p}%.", pl: "Oceniono {n} kart. Trafność {p}%.", es: "Evaluaste {n} tarjetas. Precisión {p}%.", fr: "Vous avez noté {n} cartes. Précision {p} %.", ro: "Ai evaluat {n} carduri. Acuratețe {p}%." },
  keep: { en: "Choose another level or category to keep studying.", uk: "Оберіть інший рівень або категорію.", ru: "Выберите другой уровень или категорию.", de: "Wähle eine andere Stufe oder Kategorie.", pl: "Wybierz inny poziom albo kategorię.", es: "Elige otro nivel o categoría.", fr: "Choisissez un autre niveau ou une autre catégorie.", ro: "Alege alt nivel sau altă categorie." },
  againBtn: { en: "Study again", uk: "Вчити знову", ru: "Учить снова", de: "Nochmal lernen", pl: "Ucz się znów", es: "Estudiar de nuevo", fr: "Étudier encore", ro: "Studiază din nou" },
  stats: { en: "SESSION STATS", uk: "СТАТИСТИКА СЕСІЇ", ru: "СТАТИСТИКА СЕССИИ", de: "SITZUNGSSTATISTIK", pl: "STATYSTYKI SESJI", es: "ESTADÍSTICAS", fr: "STATS DE SESSION", ro: "STATISTICI" },
  mastered: { en: "Mastered", uk: "Вивчено", ru: "Выучено", de: "Gemeistert", pl: "Opanowane", es: "Dominadas", fr: "Maîtrisées", ro: "Învățate" },
  repeat: { en: "To repeat", uk: "Повторити", ru: "Повторить", de: "Wiederholen", pl: "Do powtórki", es: "A repetir", fr: "À revoir", ro: "De repetat" },
  accuracy: { en: "Accuracy", uk: "Точність", ru: "Точность", de: "Genauigkeit", pl: "Trafność", es: "Precisión", fr: "Précision", ro: "Acuratețe" },
  mother: { en: "Mother tongue", uk: "Рідна мова", ru: "Родной язык", de: "Muttersprache", pl: "Język ojczysty", es: "Lengua materna", fr: "Langue maternelle", ro: "Limbă maternă" },
  means: { en: "What does this mean?", uk: "Що це означає?", ru: "Что это значит?", de: "Was bedeutet das?", pl: "Co to znaczy?", es: "¿Qué significa?", fr: "Qu'est-ce que cela veut dire ?", ro: "Ce înseamnă?" },
  speak: { en: "Speak Italian", uk: "Вимовити італійською", ru: "Произнести по-итальянски", de: "Italienisch sprechen", pl: "Wymów po włosku", es: "Pronunciar en italiano", fr: "Prononcer en italien", ro: "Pronunță în italiană" },
};

export function t(lang: MotherTongue, key: UiKey) {
  return UI[key][lang];
}

export function cardCount(lang: MotherTongue, n: number, total: number) {
  return t(lang, "cardOf").replace("{n}", String(n)).replace("{total}", String(total));
}

export function gradedLine(lang: MotherTongue, n: number, p: number) {
  return t(lang, "graded").replace("{n}", String(n)).replace("{p}", String(p));
}
