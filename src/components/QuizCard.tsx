import { useMemo } from "react";
import { SpeakButton } from "./SpeakButton";
import { DECK } from "../data/deck";
import { useSpeech } from "../hooks/useSpeech";
import { translationOf } from "../lib/copy";
import type { MotherTongue, StudyCard } from "../types";

type QuizCardProps = {
  card: StudyCard;
  index: number;
  total: number;
  subtitle: string;
  tongue: MotherTongue;
  pool: StudyCard[];
  onAnswer: (correct: boolean) => void;
  slide: "next" | "prev";
};

function shuffle<T>(items: T[], seed: string) {
  const copy = [...items];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  for (let i = copy.length - 1; i > 0; i -= 1) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    const j = hash % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function QuizCard({ card, index, total, tongue, pool, onAnswer, slide }: QuizCardProps) {
  const progress = total === 0 ? 0 : ((index + 1) / total) * 100;
  const { speak } = useSpeech();
  const choices = useMemo(() => {
    const extras = [...pool, ...DECK].filter((item) => item.id !== card.id);
    const unique: StudyCard[] = [];
    for (const item of extras) {
      if (unique.some((picked) => translationOf(picked, tongue) === translationOf(item, tongue))) continue;
      unique.push(item);
      if (unique.length === 3) break;
    }
    return shuffle([card, ...unique], `${card.id}-${index}`);
  }, [card, index, pool, tongue]);

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col gap-3">
      <div className="h-1 overflow-hidden rounded-full bg-[#1e293b]">
        <div
          className="h-full rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="relative min-h-0 flex-1">
      <article key={card.id} className={`absolute inset-0 flex flex-col overflow-y-auto rounded-xl border border-slate-800 bg-[#111827] px-6 ${slide === "next" ? "card-slide-next" : "card-slide-prev"}`}>
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-5 text-center">
          <div className="flex w-full items-center justify-center gap-3">
            <h2 className="text-center text-3xl font-medium tracking-normal text-white">{card.italian}</h2>
            <SpeakButton tongue={tongue} onSpeak={() => speak(card.italian)} />
          </div>
          {card.example && (
            <div className="flex w-full justify-center">
              <p className="inline-flex max-w-full items-center justify-center gap-3 text-center text-lg font-normal leading-relaxed text-slate-200">
                <span className="text-center">{card.example}</span>
                <SpeakButton tongue={tongue} onSpeak={() => speak(card.example ?? "")} />
              </p>
            </div>
          )}
        </div>
        <div className="mt-auto grid gap-2 pb-2 pt-10">
          {choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => onAnswer(choice.id === card.id)}
              className="rounded-xl border border-slate-700 bg-[#0f172a] px-4 py-3 text-center text-base text-slate-100 transition hover:border-emerald-400/60 hover:text-emerald-200"
            >
              {translationOf(choice, tongue)}
            </button>
          ))}
        </div>
      </article>
      </div>
    </section>
  );
}
