import { ChevronDown } from "lucide-react";
import { t } from "../lib/ui";
import type { MotherTongue } from "../types";

type StatsDrawerProps = {
  open: boolean;
  onToggle: () => void;
  mastered: number;
  toRepeat: number;
  accuracy: number;
  tongue: MotherTongue;
};

export function StatsDrawer({
  open,
  onToggle,
  mastered,
  toRepeat,
  accuracy,
  tongue,
}: StatsDrawerProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-[#111827]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-xs font-medium tracking-[0.18em] text-slate-400">
          {t(tongue, "stats")}
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-500 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="grid grid-cols-3 gap-3 border-t border-slate-800 px-4 py-4">
          <Stat label={t(tongue, "mastered")} value={String(mastered)} />
          <Stat label={t(tongue, "repeat")} value={String(toRepeat)} />
          <Stat label={t(tongue, "accuracy")} value={`${accuracy}%`} />
        </div>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] tracking-[0.14em] text-slate-500 uppercase">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
