import type { FilterId, Level, MotherTongue, TopicId } from "../types";

const KEY = "parliamo-session";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2"];
const TONGUES: MotherTongue[] = ["en", "uk", "ru", "de", "pl", "es", "fr", "ro"];

export type Session = {
  level: Level;
  tongue: MotherTongue;
  savedIds: string[];
  repeatIds: string[];
  studiedIds: string[];
  streak: number;
  lastStudyDay: string | null;
  cardsToday: number;
  activity: Record<string, number>;
  resume: Resume | null;
  topicProgress: Record<string, TopicProgress>;
};

export type TopicProgress = {
  section: "cards" | "test";
  cardIndex: number;
};

export type Resume = {
  active: boolean;
  moduleId: string;
  section: "cards" | "test";
  cardIndex: number;
  level: Level;
  filter: FilterId;
  topic: TopicId | null;
  customIds: string[] | null;
  customTitle: string | null;
};

export function dayKey(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function shiftDay(key: string, delta: number) {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(year, (month || 1) - 1, day || 1);
  date.setDate(date.getDate() + delta);
  return dayKey(date);
}

export function emptySession(): Session {
  return {
    level: "A1",
    tongue: "en",
    savedIds: [],
    repeatIds: [],
    studiedIds: [],
    streak: 0,
    lastStudyDay: null,
    cardsToday: 0,
    activity: {},
    resume: null,
    topicProgress: {},
  };
}

function isLevel(value: unknown): value is Level {
  return typeof value === "string" && LEVELS.includes(value as Level);
}

function isTongue(value: unknown): value is MotherTongue {
  return typeof value === "string" && TONGUES.includes(value as MotherTongue);
}

export function tongueFromLocale(locale: string | undefined): MotherTongue | null {
  const code = (locale ?? "").toLowerCase().split("-")[0];
  const normalized = code === "ua" ? "uk" : code;
  return isTongue(normalized) ? normalized : null;
}

export function deviceTongue(): MotherTongue {
  if (typeof navigator === "undefined") return "en";
  const locales = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const locale of locales) {
    const tongue = tongueFromLocale(locale);
    if (tongue) return tongue;
  }
  return "en";
}

function ids(value: unknown) {
  return Array.isArray(value) ? value.filter((id) => typeof id === "string") : [];
}

function readResume(value: unknown): Resume | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Partial<Resume>;
  if (raw.active !== true || !isLevel(raw.level) || typeof raw.moduleId !== "string") return null;
  if (raw.section !== "cards" && raw.section !== "test") return null;
  if (typeof raw.cardIndex !== "number" || raw.cardIndex < 0 || typeof raw.filter !== "string") return null;
  return {
    active: true,
    moduleId: raw.moduleId,
    section: raw.section,
    cardIndex: Math.floor(raw.cardIndex),
    level: raw.level,
    filter: raw.filter as FilterId,
    topic: typeof raw.topic === "string" ? (raw.topic as TopicId) : null,
    customIds: ids(raw.customIds).length > 0 ? ids(raw.customIds) : null,
    customTitle: typeof raw.customTitle === "string" ? raw.customTitle : null,
  };
}

export function topicKey(level: Level, filter: string, topic: string | null) {
  return `${level}:${filter}:${topic ?? ""}`;
}

function readTopicProgress(value: unknown) {
  const progress: Record<string, TopicProgress> = {};
  if (!value || typeof value !== "object") return progress;
  for (const [key, item] of Object.entries(value)) {
    if (!/^(A1|A2|B1|B2):[^:]+:[^:]*$/.test(key) || !item || typeof item !== "object") continue;
    const raw = item as Partial<TopicProgress>;
    if ((raw.section !== "cards" && raw.section !== "test") || typeof raw.cardIndex !== "number" || raw.cardIndex < 0) continue;
    progress[key] = { section: raw.section, cardIndex: Math.floor(raw.cardIndex) };
  }
  return progress;
}

function activityMap(value: unknown) {
  if (!value || typeof value !== "object") return {};
  const activity: Record<string, number> = {};
  for (const [key, count] of Object.entries(value)) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(key) && typeof count === "number" && count > 0) activity[key] = count;
  }
  return activity;
}

export function loadSession(): Session {
  const base = emptySession();
  if (typeof localStorage === "undefined") return base;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...base, tongue: deviceTongue() };
    const parsed = JSON.parse(raw) as Partial<Session>;
    const today = dayKey();
    const last = typeof parsed.lastStudyDay === "string" ? parsed.lastStudyDay : null;
    const storedToday = typeof parsed.cardsToday === "number" ? parsed.cardsToday : 0;
    const activity = activityMap(parsed.activity);
    const cardsToday = last === today ? storedToday : 0;
    if (cardsToday > 0 && !activity[today]) activity[today] = cardsToday;
    return {
      level: isLevel(parsed.level) ? parsed.level : base.level,
      tongue: isTongue(parsed.tongue) ? parsed.tongue : deviceTongue(),
      savedIds: ids(parsed.savedIds),
      repeatIds: ids(parsed.repeatIds),
      studiedIds: ids(parsed.studiedIds),
      streak: typeof parsed.streak === "number" && parsed.streak >= 0 ? parsed.streak : 0,
      lastStudyDay: last,
      cardsToday,
      activity,
      resume: readResume(parsed.resume),
      topicProgress: readTopicProgress(parsed.topicProgress),
    };
  } catch {
    return { ...base, tongue: deviceTongue() };
  }
}

export function saveSession(session: Session) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function streakOnView(session: Pick<Session, "streak" | "lastStudyDay">, today = dayKey()) {
  if (!session.lastStudyDay || session.streak <= 0) return 0;
  if (session.lastStudyDay === today || session.lastStudyDay === shiftDay(today, -1)) return session.streak;
  return 0;
}

export function nextStudy(session: Pick<Session, "streak" | "lastStudyDay" | "cardsToday" | "activity">, today = dayKey()) {
  const sameDay = session.lastStudyDay === today;
  const cardsToday = sameDay ? session.cardsToday + 1 : 1;
  const continued = session.lastStudyDay === shiftDay(today, -1);
  return {
    streak: sameDay ? Math.max(session.streak, 1) : continued ? session.streak + 1 : 1,
    lastStudyDay: today,
    cardsToday,
    activity: { ...session.activity, [today]: cardsToday },
  };
}
