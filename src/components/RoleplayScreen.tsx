import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { DECK } from "../data/deck";
import { SpeakButton } from "./SpeakButton";
import { useSpeech } from "../hooks/useSpeech";
import { t } from "../lib/ui";
import type { Level, MotherTongue } from "../types";

type RoleplayScreenProps = {
  level: Level;
  tongue: MotherTongue;
  onClose: () => void;
};

export function RoleplayScreen({ level, tongue, onClose }: RoleplayScreenProps) {
  const lines = useMemo(() => {
    const onLevel = DECK.filter((card) => card.level === level && card.example);
    const pool = onLevel.length >= 6 ? onLevel : DECK.filter((card) => card.example);
    return pool.slice(0, 8);
  }, [level]);
  const [index, setIndex] = useState(0);
  const card = lines[index];
  const { speak } = useSpeech();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-5 pb-4 pt-3">
      <button
        type="button"
        onClick={onClose}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-[#111827]"
        aria-label={t(tongue, "back")}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <header>
        <p className="text-xs tracking-[0.18em] text-emerald-400">{level}</p>
        <h1 className="mt-1 text-2xl font-medium">Практика: AI Рольова Гра</h1>
        <p className="mt-1 text-sm text-slate-400">
          {tongue === "uk" ? "Репліки з вашої колоди. Проговоріть їх уголос." : "Lines from your deck. Say them out loud."}
        </p>
      </header>
      {card && (
        <article className="flex flex-1 flex-col justify-center gap-5 rounded-3xl border border-slate-800 bg-[#111827] p-6">
          <p className="text-xs text-slate-500">{index + 1} / {lines.length}</p>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-medium text-white">{card.example}</h2>
            <SpeakButton tongue={tongue} onSpeak={() => speak(card.example ?? "")} />
          </div>
          <p className="text-lg text-slate-300">{card.exampleTranslation?.[tongue] ?? card.translation[tongue]}</p>
          <button
            type="button"
            onClick={() => setIndex((current) => (current + 1) % lines.length)}
            className="min-h-12 rounded-xl bg-emerald-500 text-sm font-medium text-slate-950"
          >
            {tongue === "uk" ? "Наступна репліка" : "Next line"}
          </button>
        </article>
      )}
    </div>
  );
}
