import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="card-nav">
      <button type="button" onClick={onPrev} disabled={!canPrev} className="card-nav-side">
        <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
        <span>{t(tongue, "back")}</span>
      </button>
      <button type="button" aria-pressed={saved} onClick={onSave} className={`card-nav-save ${saved ? "is-saved" : ""}`}>
        <Bookmark className={`h-4 w-4 shrink-0 ${saved ? "fill-current" : ""}`} aria-hidden />
        <span>{saved ? t(tongue, "saved") : t(tongue, "save")}</span>
      </button>
      <button type="button" onClick={onNext} disabled={!canNext} className="card-nav-side">
        <span>{t(tongue, "next")}</span>
        <ChevronRight className="h-5 w-5 shrink-0" aria-hidden />
      </button>
    </div>
  );
}
