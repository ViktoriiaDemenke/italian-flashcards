import { LEVELS } from "../lib/copy";
import type { Level } from "../types";

const LEVEL_TITLES: Record<Level, string> = {
  A1: "Elementare",
  A2: "Pre-intermedio",
  B1: "Intermedio",
  B2: "Avanzato",
};

type LevelsScreenProps = {
  onLevel: (level: Level) => void;
};

export function LevelsScreen({ onLevel }: LevelsScreenProps) {
  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-3 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]"
      role="group"
      aria-label="Study level"
    >
      {LEVELS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onLevel(item.id)}
          className="flex min-h-16 flex-col items-center justify-center rounded-2xl border border-slate-800 bg-[#111827] px-4 py-3 text-white"
        >
          <span className="text-xl font-medium tracking-[0.16em]">{item.id}</span>
          <span className="mt-0.5 text-sm text-slate-400">{LEVEL_TITLES[item.id]}</span>
        </button>
      ))}
    </div>
  );
}
