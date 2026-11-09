import { Volume2 } from "lucide-react";
import { TENSE_LABEL, TENSE_ORDER } from "../data/deck";
import { exampleTranslationOf, glossOf, sourceName, translationOf } from "../lib/copy";
import { speakItalian } from "../lib/speech";
import type { SourceLang, StudyCard, TenseId } from "../types";

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
  source: SourceLang;
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
  source,
  onFlip,
  onTense,
}: FlashcardProps) {
  const progress = total === 0 ? 0 : ((index + 1) / total) * 100;
  const available = TENSE_ORDER.filter((id) => card.tenses?.[id]);
  const multi = card.kind === "verb" && (card.level === "B1" || card.level === "B2") && available.length > 1;
  const activeTense = card.tenses?.[tense] ? tense : available[0];
  const shownTense = multi ? activeTense : "presente";
  const forms = shownTense ? card.tenses?.[shownTense] : undefined;
  const exampleTranslation = exampleTranslationOf(card, source);

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-slate-400">
            CARD {index + 1} OF {total}
          </p>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-[#1e293b]">
        <div
          className="h-full rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="perspective">
        <div className={`card-inner ${flipped ? "is-flipped" : ""}`}>
          <article className="card-face relative rounded-xl border border-slate-800 bg-[#111827] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-3">
              <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-emerald-300">
                {card.level}
              </span>
              <button
                type="button"
                aria-label="Speak Italian"
                onClick={(event) => {
                  event.stopPropagation();
                  speakItalian(card.italian);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-emerald-400/60 hover:text-emerald-300"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
            <button type="button" onClick={onFlip} className="flex min-h-64 w-full cursor-pointer flex-col items-center justify-center text-center">
              <p className="text-[11px] tracking-[0.22em] text-slate-500">
                {sourceName(source).toUpperCase()}
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {translationOf(card, source)}
              </h2>
              <p className="mt-8 text-xs text-slate-500">Click to reveal the Italian</p>
            </button>
          </article>

          <article className="card-face card-back rounded-xl border border-emerald-400/30 bg-[#111827] p-6 shadow-[0_0_28px_rgba(16,185,129,0.12)] sm:p-8">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
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
                  : card.kind === "verb" && (
                      <span className="rounded-full border border-slate-700 px-2.5 py-1 text-[11px] font-medium tracking-[0.14em] text-slate-300">
                        PRESENT TENSE
                      </span>
                    )}
              </div>
              <button
                type="button"
                aria-label="Speak Italian"
                onClick={(event) => {
                  event.stopPropagation();
                  speakItalian(card.italian);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/40 text-emerald-300 transition hover:bg-emerald-500/10"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
            <button type="button" onClick={onFlip} className="w-full cursor-pointer text-center">
              <p className="text-[11px] tracking-[0.22em] text-emerald-400/80">ITALIANO</p>
              <h2 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {card.italian}
              </h2>
              <p className="mt-3 text-sm text-emerald-200/90">{card.detail}</p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-300">
                {glossOf(card, source)}
              </p>
              {card.example && (
                <div className="mx-auto mt-5 max-w-md rounded-lg border border-slate-800 bg-[#0f172a] px-4 py-3 text-left">
                  <p className="text-sm italic text-slate-100">{card.example}</p>
                  {exampleTranslation && (
                    <p className="mt-1 text-sm text-slate-400">{exampleTranslation}</p>
                  )}
                </div>
              )}
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
              <p className="mt-6 text-xs text-slate-500">Click to hide the answer</p>
            </button>
          </article>
        </div>
      </div>
    </section>
  );
}
