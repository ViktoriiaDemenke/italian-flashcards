import { useMemo, useState, type MouseEvent } from "react";
import { Volume2 } from "lucide-react";
import { DECK } from "../data/deck";
import { translationOf } from "../lib/copy";
import { speakText } from "../lib/speech";
import { cardCount, t } from "../lib/ui";
import type { MotherTongue, StudyCard } from "../types";

type QuizCardProps = {
  card: StudyCard;
  index: number;
  total: number;
  subtitle: string;
  tongue: MotherTongue;
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

export function QuizCard({ card, index, total, subtitle, tongue, pool, onAnswer }: QuizCardProps) {
  const progress = total === 0 ? 0 : ((index + 1) / total) * 100;
  const [rate, setRate] = useState<1 | 0.75>(1);
  const spoken = [card.italian, card.example].filter(Boolean).join(". ");

  function speak(event: MouseEvent) {
    event.stopPropagation();
    speakText(spoken, rate);
  }
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
    <section className="space-y-3">
      <div>
        <p className="text-xs font-medium tracking-[0.18em] text-slate-400">
          {cardCount(tongue, index + 1, total)}
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
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] tracking-[0.22em] text-slate-500">{t(tongue, "means")}</p>
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-full border border-slate-700 p-0.5" role="group" aria-label="Speech speed">
              {([1, 0.75] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={rate === value}
                  onClick={() => setRate(value)}
                  className={`rounded-full px-2 py-1 text-[11px] font-medium ${
                    rate === value ? "bg-emerald-500 text-slate-950" : "text-slate-300"
                  }`}
                >
                  {value === 1 ? "1.0x" : "0.75x"}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label={t(tongue, "speak")}
              onClick={speak}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-emerald-400/60 hover:text-emerald-300"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {card.italian}
        </h2>
        <div className="mt-8 grid gap-2">
          {choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => onAnswer(choice.id === card.id)}
              className="rounded-xl border border-slate-700 bg-[#0f172a] px-4 py-3 text-left text-base text-slate-100 transition hover:border-emerald-400/60 hover:text-emerald-200"
            >
              {translationOf(choice, tongue)}
            </button>
          ))}
        </div>
      </article>
    </section>
  );
}
