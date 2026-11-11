import type { Level, MotherTongue } from "../types";

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
    tongue: "uk",
    savedIds: [],
    repeatIds: [],
    studiedIds: [],
    streak: 0,
    lastStudyDay: null,
    cardsToday: 0,
  };
}

function isLevel(value: unknown): value is Level {
  return typeof value === "string" && LEVELS.includes(value as Level);
}

function isTongue(value: unknown): value is MotherTongue {
  return typeof value === "string" && TONGUES.includes(value as MotherTongue);
}

function ids(value: unknown) {
  return Array.isArray(value) ? value.filter((id) => typeof id === "string") : [];
}

export function loadSession(): Session {
  const base = emptySession();
  if (typeof localStorage === "undefined") return base;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<Session>;
    const today = dayKey();
    const last = typeof parsed.lastStudyDay === "string" ? parsed.lastStudyDay : null;
    const storedToday = typeof parsed.cardsToday === "number" ? parsed.cardsToday : 0;
    return {
      level: isLevel(parsed.level) ? parsed.level : base.level,
      tongue: isTongue(parsed.tongue) ? parsed.tongue : base.tongue,
      savedIds: ids(parsed.savedIds),
      repeatIds: ids(parsed.repeatIds),
      studiedIds: ids(parsed.studiedIds),
      streak: typeof parsed.streak === "number" && parsed.streak >= 0 ? parsed.streak : 0,
      lastStudyDay: last,
      cardsToday: last === today ? storedToday : 0,
    };
  } catch {
    return base;
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

export function nextStudy(session: Pick<Session, "streak" | "lastStudyDay" | "cardsToday">, today = dayKey()) {
  if (session.lastStudyDay === today) {
    return { streak: Math.max(session.streak, 1), lastStudyDay: today, cardsToday: session.cardsToday + 1 };
  }
  const continued = session.lastStudyDay === shiftDay(today, -1);
  return {
    streak: continued ? session.streak + 1 : 1,
    lastStudyDay: today,
    cardsToday: 1,
  };
}
