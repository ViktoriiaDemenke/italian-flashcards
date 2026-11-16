import { useEffect, useRef, useState } from "react";
import { AudioLines, ChevronLeft, Flame, Target } from "lucide-react";
import { t, TONGUES } from "../lib/ui";
import type { MotherTongue } from "../types";

type HeaderProps = {
  streak: number;
  cardsToday: number;
  dailyGoal: number;
  studied: number;
  toRepeat: number;
  tongue: MotherTongue;
  onTongue: (tongue: MotherTongue) => void;
  compact?: boolean;
  onBack?: () => void;
};

export function Header({
  streak,
  cardsToday,
  dailyGoal,
  studied,
  toRepeat,
  tongue,
  onTongue,
  compact = false,
  onBack,
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
    <header className={compact ? "" : "space-y-4"}>
      <div className={`flex items-center gap-3 ${compact ? "w-full" : "flex-wrap"}`}>
        <div className="flex min-w-0 items-center gap-3">
          {compact && onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-[#111827] text-slate-100"
              aria-label={t(tongue, "back")}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {compact ? null : (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/40 bg-emerald-500/10 text-emerald-400">
              <AudioLines className="h-6 w-6" strokeWidth={1.5} />
            </div>
          )}
          <h1 className="truncate text-2xl font-semibold tracking-tight text-white">Parliamo</h1>
        </div>

        {compact ? null : <div className="relative ml-auto" ref={popover}>
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
        </div>}
      </div>

      {compact ? null : <div className="flex flex-wrap gap-2 text-sm">
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
      </div>}

    </header>
  );
}
