import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AudioLines, Flame, Target } from "lucide-react";
import { LEVELS } from "../lib/copy";
import { t, TONGUES } from "../lib/ui";
import type { Level, MotherTongue } from "../types";

const LEVEL_TITLES: Record<Level, string> = {
  A1: "Elementare",
  A2: "Pre-intermedio",
  B1: "Intermedio",
  B2: "Avanzato",
};

type LevelProgress = {
  total: number;
  saved: number;
};

type HeaderProps = {
  streak: number;
  cardsToday: number;
  dailyGoal: number;
  studied: number;
  toRepeat: number;
  level: Level;
  tongue: MotherTongue;
  progress: Record<Level, LevelProgress>;
  topics: ReactNode;
  onLevel: (level: Level) => void;
  onTongue: (tongue: MotherTongue) => void;
};

export function Header({
  streak,
  cardsToday,
  dailyGoal,
  studied,
  toRepeat,
  level,
  tongue,
  progress,
  topics,
  onLevel,
  onTongue,
}: HeaderProps) {
  const shown = Math.min(cardsToday, dailyGoal);
  const current = TONGUES.find((item) => item.id === tongue) ?? TONGUES[1];
  const [open, setOpen] = useState(false);
  const popover = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!popover.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/40 bg-emerald-500/10 text-emerald-400 shadow-[0_0_22px_rgba(16,185,129,0.28)]">
            <AudioLines className="h-6 w-6 drop-shadow-[0_0_10px_rgba(16,185,129,0.95)]" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Parliamo</h1>
        </div>

        <div className="relative ml-auto" ref={popover}>
            <button
              type="button"
              aria-expanded={open}
              aria-haspopup="listbox"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-[#111827] px-3 py-1.5 text-sm font-semibold tracking-wide text-slate-100 hover:border-emerald-400/60"
            >
              <span aria-hidden>🇮🇹</span> IT <span aria-hidden>➔</span> <span aria-hidden>{current.flag}</span> {current.code}
            </button>
            {open && (
              <div
                role="listbox"
                aria-label={t(tongue, "mother")}
                className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-slate-700 bg-[#111827] p-2 shadow-xl"
              >
                <p className="px-2 py-1 text-[11px] tracking-[0.16em] text-slate-500 uppercase">
                  {t(tongue, "mother")}
                </p>
                {TONGUES.map((option) => {
                  const active = option.id === tongue;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        onTongue(option.id);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm ${
                        active ? "bg-emerald-500 text-slate-950" : "text-slate-200 hover:bg-slate-800"
                      }`}
                    >
                      <span>
                        {option.flag} {option.name}
                      </span>
                      <span className="text-xs font-semibold">{option.code}</span>
                    </button>
                  );
                })}
              </div>
            )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/50 bg-emerald-500/10 px-3 py-1.5 text-emerald-200">
          <Flame className="h-3.5 w-3.5 text-emerald-300" />
          {streak} {t(tongue, "streak")}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-[#111827] px-3 py-1.5 text-slate-200">
          <Target className="h-3.5 w-3.5 text-emerald-300" />
          {t(tongue, "cardsToday")}: {shown}/{dailyGoal}
        </span>
        <span className="inline-flex items-center rounded-full border border-slate-700 bg-[#111827] px-3 py-1.5 text-slate-200">
          {t(tongue, "studied")}: {studied}
        </span>
        <span className="inline-flex items-center rounded-full border border-slate-700 bg-[#111827] px-3 py-1.5 text-slate-200">
          {t(tongue, "repeat")}: {toRepeat}
        </span>
      </div>

      <div className="flex flex-col gap-2" role="group" aria-label="Study level">
        {LEVELS.map((item) => {
          const active = item.id === level;
          if (!active) {
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={false}
                onClick={() => onLevel(item.id)}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#111827] px-4 py-2 text-left text-slate-400 hover:border-slate-600"
              >
                <span>
                  <span className="font-semibold tracking-[0.14em] text-slate-500">{item.id}</span>{" "}
                  <span className="text-sm text-slate-300">{LEVEL_TITLES[item.id]}</span>
                </span>
                <span className="text-xs text-slate-500">
                  {progress[item.id].saved}/{progress[item.id].total}
                </span>
              </button>
            );
          }
          return (
            <div
              key={item.id}
              className="rounded-2xl border border-[#10b981] bg-[#111827] px-4 py-3.5 shadow-[0_0_22px_rgba(16,185,129,0.38)]"
            >
              <button type="button" aria-pressed className="w-full text-left" onClick={() => onLevel(item.id)}>
                <span className="text-xs font-semibold tracking-[0.16em] text-emerald-400">{item.id}</span>
                <span className="mt-0.5 block text-base font-medium text-white">{LEVEL_TITLES[item.id]}</span>
                <span className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-400">
                  <span>
                    {progress[item.id].saved}/{progress[item.id].total}
                  </span>
                  <span className="text-emerald-300">
                    {progress[item.id].total === 0
                      ? "0%"
                      : `${Math.round((progress[item.id].saved / progress[item.id].total) * 100)}%`}
                  </span>
                </span>
                <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-slate-800">
                  <span
                    className="block h-full rounded-full bg-[#10b981]"
                    style={{
                      width:
                        progress[item.id].total === 0
                          ? "0%"
                          : `${Math.min(100, Math.round((progress[item.id].saved / progress[item.id].total) * 100))}%`,
                    }}
                  />
                </span>
              </button>
              <div className="mt-3 border-t border-slate-800 pt-3">{topics}</div>
            </div>
          );
        })}
      </div>
    </header>
  );
}
