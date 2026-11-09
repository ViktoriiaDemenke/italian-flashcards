import { useState, type MouseEvent } from "react";
import { RefreshCw, Volume2 } from "lucide-react";
import { TENSE_LABEL, TENSE_ORDER } from "../data/deck";
import { exampleTranslationOf, translationOf } from "../lib/copy";
import { speakText } from "../lib/speech";
import { cardCount, t } from "../lib/ui";
import type { MotherTongue, StudyCard, TenseId } from "../types";

const PAIRS: { label: string; key: "io" | "tu" | "lui" | "noi" | "voi" | "loro" }[] = [
  { label: "IO", key: "io" },
  { label: "TU", key: "tu" },
  { label: "LUI/LEI", key: "lui" },
  { label: "NOI", key: "noi" },
  { label: "VOI", key: "voi" },
  { label: "LORO", key: "loro" },
];

type FlashcardProps = {
  card: StudyCard;
  index: number;
  total: number;
  subtitle: string;
  flipped: boolean;
  tense: TenseId;
  tongue: MotherTongue;
  onFlip: () => void;
  onTense: (tense: TenseId) => void;
};

export function Flashcard({
  card,
  index,
  total,
  subtitle,
  flipped,
  tense,
  tongue,
  onFlip,
  onTense,
}: FlashcardProps) {
  const progress = total === 0 ? 0 : ((index + 1) / total) * 100;
  const available = TENSE_ORDER.filter((id) => card.tenses?.[id]);
  const multi = card.kind === "verb" && (card.level === "B1" || card.level === "B2") && available.length > 1;
  const activeTense = card.tenses?.[tense] ? tense : available[0];
  const shownTense = multi ? activeTense : "presente";
  const forms = card.kind === "verb" && shownTense ? card.tenses?.[shownTense] : undefined;
  const exampleTranslation = exampleTranslationOf(card, tongue);
  const [rate, setRate] = useState<1 | 0.75>(1);
  const spoken = [card.italian, card.example].filter(Boolean).join(". ");

  function speak(event: MouseEvent) {
    event.stopPropagation();
    speakText(spoken, rate);
  }

  function chooseRate(event: MouseEvent, next: 1 | 0.75) {
    event.stopPropagation();
    setRate(next);
  }

  const rates = (
    <div className="inline-flex rounded-full border border-slate-700 p-0.5" role="group" aria-label="Speech speed">
      {([1, 0.75] as const).map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={rate === value}
          onClick={(event) => chooseRate(event, value)}
          className={`rounded-full px-2 py-1 text-[11px] font-medium ${
            rate === value ? "bg-emerald-500 text-slate-950" : "text-slate-300"
          }`}
        >
          {value === 1 ? "1.0x" : "0.75x"}
        </button>
      ))}
    </div>
  );

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

      <div className="perspective" key={card.id}>
        <div className={`card-inner ${flipped ? "is-flipped" : ""}`}>
          <article className="card-face relative rounded-xl border border-slate-800 bg-[#111827] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-8">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-emerald-300">
                  {card.level}
                </span>
                {card.kind === "verb" && multi
                  ? available.map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onTense(id);
                        }}
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-[0.12em] uppercase ${
                          id === shownTense
                            ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-200"
                            : "border-slate-700 text-slate-400 hover:border-slate-500"
                        }`}
                      >
                        {TENSE_LABEL[id]}
                      </button>
                    ))
                  : null}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={t(tongue, "flip")}
                  onClick={(event) => {
                    event.stopPropagation();
                    onFlip();
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-emerald-400/60 hover:text-emerald-300"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                {rates}
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
            <button type="button" onClick={onFlip} className="w-full cursor-pointer text-center">
              <p className="text-[11px] tracking-[0.22em] text-slate-500">ITALIANO</p>
              <h2 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {card.italian}
              </h2>
              {forms && (
                <div className="mx-auto mt-6 grid max-w-lg grid-cols-2 gap-x-8 gap-y-4 text-left">
                  {PAIRS.map((person) => (
                    <div key={person.key} className="border-t border-slate-800 pt-2">
                      <p className="text-[11px] tracking-[0.16em] text-slate-500">{person.label}</p>
                      <p className="mt-1 text-base text-slate-100">{forms[person.key]}</p>
                    </div>
                  ))}
                </div>
              )}
              {card.example && (
                <p className="mx-auto mt-6 max-w-md text-sm italic text-slate-300">{card.example}</p>
              )}
              <p className="mt-6 text-xs text-slate-500">{t(tongue, "reveal")}</p>
            </button>
          </article>

          <article className="card-face card-back rounded-xl border border-emerald-400/30 bg-[#111827] p-6 shadow-[0_0_28px_rgba(16,185,129,0.12)] sm:p-8">
            <div className="mb-4 flex justify-end gap-2">
              <button
                type="button"
                aria-label={t(tongue, "flip")}
                onClick={(event) => {
                  event.stopPropagation();
                  onFlip();
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/40 text-emerald-300 transition hover:bg-emerald-500/10"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              {rates}
              <button
                type="button"
                aria-label={t(tongue, "speak")}
                onClick={speak}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/40 text-emerald-300 transition hover:bg-emerald-500/10"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={onFlip}
              className="flex min-h-72 w-full cursor-pointer flex-col items-center justify-center text-center"
            >
              <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {translationOf(card, tongue)}
              </h2>
              {exampleTranslation && (
                <p className="mx-auto mt-6 max-w-md text-base text-slate-300">{exampleTranslation}</p>
              )}
              <p className="mt-8 text-xs text-slate-500">{t(tongue, "hide")}</p>
            </button>
          </article>
        </div>
      </div>
    </section>
  );
}
