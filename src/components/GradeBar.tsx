import { Check, RotateCcw, Sparkles } from "lucide-react";
import type { GradeId } from "../types";

const GRADES: {
  id: GradeId;
  label: string;
  hint: string;
  icon: typeof Check;
  className: string;
}[] = [
  {
    id: "again",
    label: "Again",
    hint: "< 1 MIN",
    icon: RotateCcw,
    className:
      "border-rose-400/50 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20",
  },
  {
    id: "hard",
    label: "Hard",
    hint: "1 DAY",
    icon: Check,
    className:
      "border-orange-400/50 bg-orange-500/10 text-orange-200 hover:bg-orange-500/20",
  },
  {
    id: "good",
    label: "Good",
    hint: "3 DAYS",
    icon: Check,
    className:
      "border-emerald-400/70 bg-transparent text-emerald-300 hover:bg-emerald-500/10",
  },
  {
    id: "easy",
    label: "Easy",
    hint: "7 DAYS",
    icon: Sparkles,
    className:
      "border-emerald-400 bg-emerald-500 text-slate-950 shadow-[0_0_18px_rgba(16,185,129,0.4)] hover:bg-emerald-400",
  },
];

type GradeBarProps = {
  enabled: boolean;
  onGrade: (grade: GradeId) => void;
};

export function GradeBar({ enabled, onGrade }: GradeBarProps) {
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
                {grade.label}
              </span>
              <span className="mt-1 block text-[11px] tracking-[0.12em] opacity-80">
                {grade.hint}
              </span>
            </button>
          );
        })}
      </div>
      {!enabled && (
        <p className="text-center text-sm text-slate-500">Reveal the card to grade your recall</p>
      )}
    </div>
  );
}
