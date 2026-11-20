import { Volume2 } from "lucide-react";
import { t } from "../lib/ui";
import type { MotherTongue } from "../types";

type SpeakButtonProps = {
  tongue: MotherTongue;
  onSpeak: () => void;
  className?: string;
};

export function SpeakButton({ tongue, onSpeak, className = "" }: SpeakButtonProps) {
  return (
    <button
      type="button"
      aria-label={t(tongue, "speak")}
      onClick={(event) => {
        event.stopPropagation();
        onSpeak();
      }}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-[#0f172a] text-slate-100 ${className}`}
    >
      <Volume2 className="h-5 w-5" strokeWidth={1.75} />
    </button>
  );
}
