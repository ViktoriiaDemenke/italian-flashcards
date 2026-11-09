import { Flame, Languages, Target } from "lucide-react";
import { LEVELS, SOURCE_OPTIONS } from "../lib/copy";
import type { Level, SourceLang } from "../types";

type HeaderProps = {
  streak: number;
  cardsToday: number;
  dailyGoal: number;
  level: Level;
  source: SourceLang;
  onLevel: (level: Level) => void;
  onSource: (source: SourceLang) => void;
};

export function Header({
  streak,
  cardsToday,
  dailyGoal,
  level,
  source,
  onLevel,
  onSource,
}: HeaderProps) {
  const shown = Math.min(cardsToday, dailyGoal);

  return (
    <header className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/40 bg-emerald-500/10 text-emerald-400 shadow-[0_0_22px_rgba(16,185,129,0.28)]">
            <Languages className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Parliamo</h1>
            <p className="text-[11px] font-medium tracking-[0.22em] text-slate-400">
              ITALIAN STUDY STUDIO
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-500/10 px-3 py-1.5 text-sm text-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.28)]">
            <Flame className="h-3.5 w-3.5 text-orange-300" />
            {streak} Day Streak
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/50 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.28)]">
            <Target className="h-3.5 w-3.5" />
            Cards today: {shown}/{dailyGoal}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((item) => {
            const active = item.id === level;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onLevel(item.id)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                  active
                    ? "border-emerald-400/70 bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.45)]"
                    : "border-slate-700 bg-[#111827] text-slate-300 hover:border-slate-500"
                }`}
              >
                <span className="font-semibold">{item.id}</span>{" "}
                <span className={active ? "text-slate-900/80" : "text-slate-400"}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        <label className="flex items-center gap-2 text-xs tracking-[0.16em] text-slate-500">
          FROM
          <select
            aria-label="Source language"
            value={source}
            onChange={(event) => onSource(event.target.value as SourceLang)}
            className="rounded-full border border-slate-700 bg-[#111827] px-3 py-1.5 text-sm tracking-normal text-slate-100 outline-none focus:border-emerald-400/70"
          >
            {SOURCE_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.flag} {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
}
