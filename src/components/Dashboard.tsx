import { useMemo, useState } from "react";
import { Check, MessagesSquare } from "lucide-react";
import { DECK } from "../data/deck";
import { LEVELS } from "../lib/copy";
import { dailyMix } from "../lib/mix";
import { dayKey } from "../lib/session";
import { t } from "../lib/ui";
import type { Level, MotherTongue } from "../types";

const LEVEL_TITLES: Record<Level, string> = {
  A1: "Elementare",
  A2: "Pre-intermedio",
  B1: "Intermedio",
  B2: "Avanzato",
};

type DashboardProps = {
  level: Level;
  tongue: MotherTongue;
  streak: number;
  cardsToday: number;
  activity: Record<string, number>;
  studiedIds: string[];
  repeatIds: string[];
  savedIds: string[];
  onRoleplay: () => void;
  onLevel: (level: Level) => void;
  onStartMix: (ids: string[]) => void;
  canContinue: boolean;
  onContinue: () => void;
};

export function Dashboard({
  level,
  tongue,
  streak,
  cardsToday,
  activity,
  studiedIds,
  repeatIds,
  savedIds,
  onRoleplay,
  onLevel,
  onStartMix,
  canContinue,
  onContinue,
}: DashboardProps) {
  const mix = dailyMix(level, repeatIds, studiedIds, savedIds);
  const attention = mix.filter((card) => repeatIds.includes(card.id) || savedIds.includes(card.id)).length;
  const mastered = mix.filter(
    (card) => studiedIds.includes(card.id) && !repeatIds.includes(card.id) && !savedIds.includes(card.id),
  ).length;
  const [selectedDay, setSelectedDay] = useState(dayKey());
  const week = useMemo(() => currentWeek(), []);
  const todayKey = dayKey();
  const levelStats = LEVELS.map((item) => {
    const total = DECK.filter((card) => card.level === item.id).length;
    const done = DECK.filter((card) => card.level === item.id && studiedIds.includes(card.id)).length;
    return { ...item, total, done, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
  });

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-2.5 px-5 pb-4 pt-3">
      {canContinue && (
        <button
          type="button"
          onClick={onContinue}
          className="min-h-12 rounded-2xl bg-emerald-500 text-sm font-medium text-slate-950"
        >
          {t(tongue, "continueSession")}
        </button>
      )}
      <section className="rounded-2xl border border-slate-800 bg-[#111827] px-4 py-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-medium text-white">{streak}</p>
            <p className="text-xs text-slate-400">{t(tongue, "streak")}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-medium text-white">{cardsToday}</p>
            <p className="text-xs text-slate-400">{t(tongue, "cardsToday")}</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1.5" aria-label={t(tongue, "activity")}>
          {week.map((day, index) => {
            const count = activity[day] ?? 0;
            const done = count > 0 && day <= todayKey;
            const isToday = day === todayKey;
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`flex h-14 min-h-11 flex-col items-center justify-center rounded-xl ${
                  done ? "bg-green-500/20 text-green-400" : "bg-white/5 text-gray-500"
                } ${isToday ? "border border-green-500" : "border border-transparent"}`}
                aria-label={`${day}: ${count}`}
                aria-pressed={selectedDay === day}
              >
                <span className="text-xs">{weekdayLabel(index, tongue)}</span>
                <span className="text-lg font-bold leading-none">{Number(day.slice(-2))}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-center text-xs text-slate-400">{dayCaption(selectedDay, activity[selectedDay] ?? 0, tongue)}</p>
      </section>

      <button
        type="button"
        onClick={onRoleplay}
        className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-emerald-400/40 bg-[#111827] text-sm font-medium text-emerald-200"
      >
        <MessagesSquare className="h-4 w-4" />
        {t(tongue, "roleplayPractice")}
      </button>

      <header>
        <p className="text-xs tracking-[0.22em] text-emerald-400">PARLIAMO</p>
        <h1 className="mt-0.5 text-xl font-medium">{t(tongue, "dailyMix")}</h1>
        <p className="mt-1 text-sm text-slate-400">
          {t(tongue, "mixSummary")
            .replace("{n}", String(mix.length))
            .replace("{a}", String(attention))
            .replace("{m}", String(mastered))}
        </p>
      </header>

      <section className="rounded-2xl border border-slate-800 bg-[#111827] p-3">
        <ul className="grid grid-cols-2 gap-2">
          {mix.slice(0, 4).map((card) => {
            const needsAttention = repeatIds.includes(card.id) || savedIds.includes(card.id);
            const known = studiedIds.includes(card.id) && !needsAttention;
            return (
              <li key={card.id} className="flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0f172a] px-2.5 py-2">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    needsAttention ? "bg-red-500/15 text-red-400" : known ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-800 text-slate-500"
                  }`}
                  aria-hidden
                >
                  {known ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : <span className={`h-2 w-2 rounded-full ${needsAttention ? "bg-red-400" : "bg-slate-500"}`} />}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm text-white">{card.italian}</span>
                  <span className="block truncate text-xs text-slate-400">{card.translation[tongue]}</span>
                </span>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={() => onStartMix(mix.map((card) => card.id))}
          className="mt-2.5 flex min-h-11 w-full items-center justify-center rounded-xl bg-emerald-500 text-sm font-medium text-slate-950"
        >
          {t(tongue, "startMix")}
        </button>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-slate-400">{t(tongue, "myModules")}</h2>
        {levelStats.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onLevel(item.id)}
            className={`rounded-2xl border bg-[#111827] px-4 py-3 text-left ${
              item.id === level ? "border-emerald-400/60" : "border-slate-800"
            }`}
          >
            <span className="flex items-baseline justify-between gap-3">
              <span>
                <span className="text-base font-medium text-white">{item.id}</span>
                <span className="ml-2 text-sm text-slate-400">{LEVEL_TITLES[item.id]}</span>
              </span>
              <span className="text-sm text-emerald-300">{item.percent}%</span>
            </span>
            <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[#1e293b]">
              <span className="block h-full rounded-full bg-emerald-500" style={{ width: `${item.percent}%` }} />
            </span>
          </button>
        ))}
      </section>
    </div>
  );
}

function currentWeek() {
  const today = new Date();
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - mondayOffset);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return dayKey(date);
  });
}

function weekdayLabel(index: number, tongue: MotherTongue) {
  const labels: Record<MotherTongue, string[]> = {
    en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    uk: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"],
    ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    pl: ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"],
    es: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    fr: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    ro: ["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"],
  };
  return labels[tongue][index] ?? "";
}

function dayCaption(key: string, count: number, tongue: MotherTongue) {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(year, (month || 1) - 1, day || 1);
  const locales: Record<MotherTongue, string> = {
    en: "en-GB", uk: "uk-UA", ru: "ru-RU", de: "de-DE", pl: "pl-PL", es: "es-ES", fr: "fr-FR", ro: "ro-RO",
  };
  const label = date.toLocaleDateString(locales[tongue], { day: "numeric", month: "short" });
  return count === 0 ? `${label} · ${t(tongue, "noStudy")}` : `${label} · ${count} ${t(tongue, "cardsWord")}`;
}
