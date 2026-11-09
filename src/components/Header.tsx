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
    <header className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/40 bg-emerald-500/10 text-emerald-400 shadow-[0_0_22px_rgba(16,185,129,0.28)]">
            <Languages className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Parliamo</h1>
        </div>

        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-500/10 px-3 py-1.5 text-sm text-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.28)]">
            <Flame className="h-3.5 w-3.5 text-orange-300" />
            {streak} Day Streak
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/50 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.28)]">
            <Target className="h-3.5 w-3.5" />
            Cards today: {shown}/{dailyGoal}
          </span>
          <div
            className="inline-flex rounded-full border border-slate-700 bg-[#111827] p-0.5"
            role="group"
            aria-label="Source language"
          >
            {SOURCE_OPTIONS.map((option) => {
              const active = option.id === source;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  title={option.label}
                  onClick={() => onSource(option.id)}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide transition ${
                    active
                      ? "bg-emerald-500 text-slate-950"
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  {option.code}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className="grid grid-cols-2 gap-1 rounded-full border border-slate-700 bg-[#111827] p-1 sm:grid-cols-4"
        role="group"
        aria-label="Study level"
      >
        {LEVELS.map((item) => {
          const active = item.id === level;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => onLevel(item.id)}
              className={`rounded-full px-2 py-1.5 text-center text-sm transition ${
                active
                  ? "bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.45)]"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span className="font-semibold">{item.id}</span>{" "}
              <span className={active ? "text-slate-900/80" : "text-slate-400"}>{item.name}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
