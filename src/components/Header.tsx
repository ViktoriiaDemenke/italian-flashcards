import { useEffect, useRef, useState } from "react";
import { Flame, Languages, Target } from "lucide-react";
import { LEVELS } from "../lib/copy";
import { t, TONGUES } from "../lib/ui";
import type { Level, MotherTongue } from "../types";

type HeaderProps = {
  streak: number;
  cardsToday: number;
  dailyGoal: number;
  level: Level;
  tongue: MotherTongue;
  onLevel: (level: Level) => void;
  onTongue: (tongue: MotherTongue) => void;
};

export function Header({
  streak,
  cardsToday,
  dailyGoal,
  level,
  tongue,
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
            <Languages className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Parliamo</h1>
        </div>

        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-500/10 px-3 py-1.5 text-sm text-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.28)]">
            <Flame className="h-3.5 w-3.5 text-orange-300" />
            {streak} {t(tongue, "streak")}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/50 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.28)]">
            <Target className="h-3.5 w-3.5" />
            {t(tongue, "cardsToday")}: {shown}/{dailyGoal}
          </span>
          <div className="relative" ref={popover}>
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
              <span className={active ? "text-slate-900/80" : "text-slate-400"}>
                {t(tongue, item.nameKey)}
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
