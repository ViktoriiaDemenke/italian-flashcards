import { Bookmark } from "lucide-react";
import { t } from "../lib/ui";
import type { MotherTongue } from "../types";

type CardNavProps = {
  tongue: MotherTongue;
  canPrev: boolean;
  canNext: boolean;
  saved: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSave: () => void;
};

export function CardNav({ tongue, canPrev, canNext, saved, onPrev, onNext, onSave }: CardNavProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_1fr]">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className="rounded-xl border border-slate-700 bg-[#111827] px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t(tongue, "back")}
      </button>
      <button
        type="button"
        aria-pressed={saved}
        onClick={onSave}
        className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
          saved
            ? "border-emerald-400 bg-emerald-500 text-slate-950"
            : "border-emerald-400/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
        }`}
      >
        <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
        {saved ? t(tongue, "saved") : t(tongue, "save")}
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="rounded-xl border border-slate-700 bg-[#111827] px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t(tongue, "next")}
      </button>
    </div>
  );
}
