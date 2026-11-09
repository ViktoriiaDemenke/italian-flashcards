import { useMemo } from "react";
import { DECK } from "../data/deck";
import { translationOf } from "../lib/copy";
import type { SourceLang, StudyCard } from "../types";

type QuizCardProps = {
  card: StudyCard;
  index: number;
  total: number;
  subtitle: string;
  source: SourceLang;
  pool: StudyCard[];
  onAnswer: (correct: boolean) => void;
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

export function QuizCard({ card, index, total, subtitle, source, pool, onAnswer }: QuizCardProps) {
  const progress = total === 0 ? 0 : ((index + 1) / total) * 100;
  const choices = useMemo(() => {
    const extras = [...pool, ...DECK].filter((item) => item.id !== card.id);
    const unique: StudyCard[] = [];
    for (const item of extras) {
      if (unique.some((picked) => picked.italian === item.italian)) continue;
      unique.push(item);
      if (unique.length === 3) break;
    }
    return shuffle([card, ...unique], `${card.id}-${index}`);
  }, [card, index, pool]);

  return (
    <section className="space-y-3">
      <div>
        <p className="text-xs font-medium tracking-[0.18em] text-slate-400">
          CARD {index + 1} OF {total}
        </p>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-[#1e293b]">
        <div
          className="h-full rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <article className="rounded-xl border border-slate-800 bg-[#111827] p-6 sm:p-8">
        <p className="text-[11px] tracking-[0.22em] text-slate-500">WHICH ITALIAN WORD?</p>
        <h2 className="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {translationOf(card, source)}
        </h2>
        <div className="mt-8 grid gap-2">
          {choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => onAnswer(choice.id === card.id)}
              className="rounded-xl border border-slate-700 bg-[#0f172a] px-4 py-3 text-left text-base text-slate-100 transition hover:border-emerald-400/60 hover:text-emerald-200"
            >
              {choice.italian}
            </button>
          ))}
        </div>
      </article>
    </section>
  );
}
