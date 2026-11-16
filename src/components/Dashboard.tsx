import { useMemo, useState } from "react";
import { Camera, Check, MessagesSquare, Sparkles } from "lucide-react";
import { DECK } from "../data/deck";
import { LEVELS } from "../lib/copy";
import { cardsForPhoto, cardsForTheme, dailyMix } from "../lib/mix";
import { dayKey } from "../lib/session";
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
  onStartGenerated: (ids: string[], title: string) => void;
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
  onStartGenerated,
  canContinue,
  onContinue,
}: DashboardProps) {
  const mix = dailyMix(level, repeatIds, studiedIds, savedIds);
  const attention = mix.filter((card) => repeatIds.includes(card.id) || savedIds.includes(card.id)).length;
  const mastered = mix.filter(
    (card) => studiedIds.includes(card.id) && !repeatIds.includes(card.id) && !savedIds.includes(card.id),
  ).length;
  const [generator, setGenerator] = useState(false);
  const [theme, setTheme] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [notice, setNotice] = useState("");
  const [pickedDay, setPickedDay] = useState(dayKey());
  const weeks = useMemo(() => activityWeeks(), []);
  const levelStats = LEVELS.map((item) => {
    const total = DECK.filter((card) => card.level === item.id).length;
    const done = DECK.filter((card) => card.level === item.id && studiedIds.includes(card.id)).length;
    return { ...item, total, done, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
  });

  function createFromTheme() {
    const query = theme.trim();
    const cards = query ? cardsForTheme(query, tongue) : [];
    if (cards.length === 0 && hasPhoto) {
      const scene = cardsForPhoto(level);
      setNotice("");
      onStartGenerated(scene.map((card) => card.id), tongue === "uk" ? "За фото" : "From photo");
      return;
    }
    if (cards.length === 0) {
      setNotice(tongue === "uk" ? "У колоді немає слів за цією темою. Спробуйте інше слово." : "No deck words match this theme.");
      return;
    }
    setNotice("");
    onStartGenerated(
      cards.map((card) => card.id),
      query,
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-2.5 px-5 pb-4 pt-3">
      {canContinue && (
        <button
          type="button"
          onClick={onContinue}
          className="min-h-12 rounded-2xl bg-emerald-500 text-sm font-medium text-slate-950"
        >
          {tongue === "uk" ? "Продовжити сесію" : "Continue session"}
        </button>
      )}
      <section className="rounded-2xl border border-slate-800 bg-[#111827] px-4 py-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-medium text-white">{streak}</p>
            <p className="text-xs text-slate-400">{tongue === "uk" ? "серія днів" : "day streak"}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-medium text-white">{cardsToday}</p>
            <p className="text-xs text-slate-400">{tongue === "uk" ? "сьогодні карток" : "cards today"}</p>
          </div>
        </div>
        <div className="mt-2.5 grid w-full grid-flow-col grid-rows-7 gap-1" aria-label={tongue === "uk" ? "Активність" : "Activity"}>
          {weeks.map((day, index) => (
            <button
              key={day.key || `empty-${index}`}
              type="button"
              disabled={!day.key}
              onClick={() => day.key && setPickedDay(day.key)}
              className="h-2.5 w-full rounded-[3px] disabled:bg-transparent"
              style={{ background: day.key ? heatColor(activity[day.key] ?? 0) : "transparent" }}
              aria-label={day.key ? `${day.key}: ${activity[day.key] ?? 0}` : undefined}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-400">{dayCaption(pickedDay, activity[pickedDay] ?? 0, tongue)}</p>
      </section>

      <button
        type="button"
        onClick={onRoleplay}
        className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-emerald-400/40 bg-[#111827] text-sm font-medium text-emerald-200"
      >
        <MessagesSquare className="h-4 w-4" />
        Практика: AI Рольова Гра
      </button>

      <header>
        <p className="text-xs tracking-[0.22em] text-emerald-400">PARLIAMO</p>
        <h1 className="mt-0.5 text-xl font-medium">Smart Daily Mix</h1>
        <p className="mt-1 text-sm text-slate-400">
          {tongue === "uk"
            ? `${mix.length} карток · ${attention} потребують уваги · ${mastered} засвоєно`
            : `${mix.length} cards · ${attention} need attention · ${mastered} mastered`}
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
          Розпочати Smart Мікс
        </button>
      </section>

      <button
        type="button"
        onClick={() => {
          setGenerator((open) => !open);
          setNotice("");
        }}
        className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-emerald-400/40 bg-[#111827] text-sm font-medium text-emerald-200"
      >
        <Sparkles className="h-4 w-4" />
        AI Генератор (за фото/темою)
      </button>

      {generator && (
        <form
          className="flex flex-col gap-3 rounded-3xl border border-slate-800 bg-[#111827] p-4"
          onSubmit={(event) => {
            event.preventDefault();
            createFromTheme();
          }}
        >
          <label className="text-sm text-slate-300">
            {tongue === "uk" ? "Тема" : "Theme"}
            <input
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
              placeholder={tongue === "uk" ? "наприклад, кухня" : "for example, kitchen"}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-[#0f172a] px-3 py-3 text-base text-white outline-none"
            />
          </label>
          <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-600 text-sm text-slate-300">
            <Camera className="h-4 w-4" />
            {photoName || (tongue === "uk" ? "Додати фото" : "Add a photo")}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setHasPhoto(Boolean(file));
                setPhotoName(file?.name ?? "");
                setNotice("");
              }}
            />
          </label>
          {notice && <p className="text-sm text-red-300">{notice}</p>}
          <button type="submit" className="min-h-12 rounded-xl bg-emerald-500 text-sm font-medium text-slate-950">
            {tongue === "uk" ? "Зібрати картки" : "Build cards"}
          </button>
        </form>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-slate-400">{tongue === "uk" ? "Мої Модулі" : "My modules"}</h2>
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

function activityWeeks() {
  const today = new Date();
  const mondayOffset = (today.getDay() + 6) % 7;
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - mondayOffset - 7 * 11);
  const todayKey = dayKey(today);
  const cells: { key: string }[] = [];
  for (let week = 0; week < 12; week += 1) {
    for (let row = 0; row < 7; row += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + week * 7 + row);
      const key = dayKey(date);
      cells.push({ key: key <= todayKey ? key : "" });
    }
  }
  return cells;
}

function heatColor(count: number) {
  if (count <= 0) return "#1e293b";
  if (count < 4) return "rgba(16, 185, 129, 0.45)";
  if (count < 8) return "rgba(16, 185, 129, 0.75)";
  return "#10b981";
}

function dayCaption(key: string, count: number, tongue: MotherTongue) {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(year, (month || 1) - 1, day || 1);
  const label = date.toLocaleDateString(tongue === "uk" ? "uk-UA" : "en-GB", { day: "numeric", month: "short" });
  if (tongue === "uk") return count === 0 ? `${label} · без занять` : `${label} · ${count} карток`;
  return count === 0 ? `${label} · no study` : `${label} · ${count} cards`;
}
