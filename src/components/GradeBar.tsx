import { Check, RotateCcw, Sparkles } from "lucide-react";
import { t } from "../lib/ui";
import type { GradeId, MotherTongue } from "../types";

const GRADES: {
  id: GradeId;
  label: "again" | "hard" | "good" | "easy";
  hint: "min" | "day" | "days3" | "days7";
  icon: typeof Check;
  className: string;
}[] = [
  {
    id: "again",
    label: "again",
    hint: "min",
    icon: RotateCcw,
    className:
      "border-rose-400/50 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20",
  },
  {
    id: "hard",
    label: "hard",
    hint: "day",
    icon: Check,
    className:
      "border-orange-400/50 bg-orange-500/10 text-orange-200 hover:bg-orange-500/20",
  },
  {
    id: "good",
    label: "good",
    hint: "days3",
    icon: Check,
    className:
      "border-emerald-400/70 bg-transparent text-emerald-300 hover:bg-emerald-500/10",
  },
  {
    id: "easy",
    label: "easy",
    hint: "days7",
    icon: Sparkles,
    className:
      "border-emerald-400 bg-emerald-500 text-slate-950 shadow-[0_0_18px_rgba(16,185,129,0.4)] hover:bg-emerald-400",
  },
];

type GradeBarProps = {
  enabled: boolean;
  tongue: MotherTongue;
  onGrade: (grade: GradeId) => void;
};

export function GradeBar({ enabled, tongue, onGrade }: GradeBarProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {GRADES.map((grade) => {
          const Icon = grade.icon;
          return (
            <button
              key={grade.id}
              type="button"
              disabled={!enabled}
              onClick={() => onGrade(grade.id)}
              className={`rounded-xl border px-3 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${grade.className}`}
            >
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <Icon className="h-3.5 w-3.5" />
                {t(tongue, grade.label)}
              </span>
              <span className="mt-1 block text-[11px] tracking-[0.12em] opacity-80">
                {t(tongue, grade.hint)}
              </span>
            </button>
          );
        })}
      </div>
      {!enabled && (
        <p className="text-center text-sm text-slate-500">{t(tongue, "revealToGrade")}</p>
      )}
    </div>
  );
}
