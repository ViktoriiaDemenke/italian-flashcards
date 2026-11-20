import { useEffect, useState } from "react";
import { Sparkles, Volume2 } from "lucide-react";
import { SpeakButton } from "./SpeakButton";
import { TENSE_LABEL, TENSE_ORDER } from "../data/deck";
import { grammarLines } from "../lib/cardHelp";
import { exampleTranslationOf, translationOf } from "../lib/copy";
import { useSpeech } from "../hooks/useSpeech";
import { t } from "../lib/ui";
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
  slide: "next" | "prev";
};

export function Flashcard({
  card,
  index,
  total,
  flipped,
  tense,
  tongue,
  onFlip,
  onTense,
  slide,
}: FlashcardProps) {
  const progress = total === 0 ? 0 : ((index + 1) / total) * 100;
  const available = TENSE_ORDER.filter((id) => card.tenses?.[id]);
  const multi = card.kind === "verb" && (card.level === "B1" || card.level === "B2") && available.length > 1;
  const activeTense = card.tenses?.[tense] ? tense : available[0];
  const shownTense = multi ? activeTense : "presente";
  const forms = card.kind === "verb" && shownTense ? card.tenses?.[shownTense] : undefined;
  const exampleTranslation = exampleTranslationOf(card, tongue);
  const { speak } = useSpeech();
  const [rate, setRate] = useState<1 | 0.7>(() => (localStorage.getItem("parliamo-rate") === "0.7" ? 0.7 : 1));
  const [hintOpen, setHintOpen] = useState(false);
  useEffect(() => {
    setHintOpen(false);
    document.querySelectorAll(".card-face").forEach((face) => {
      face.scrollTop = 0;
    });
  }, [card.id]);

  const contexts = (card.contextExamples ?? []).map((item) => ({
    italian: item.italian,
    gloss: tongue === "uk" ? item.uk : item.en || item.uk,
  }));
  const hint = grammarLines(card, tongue);

  function chooseRate(next: 1 | 0.7) {
    setRate(next);
    localStorage.setItem("parliamo-rate", String(next));
  }

  function playWord(event: { stopPropagation: () => void }) {
    event.stopPropagation();
    speak(card.italian, rate);
  }

  const exampleSpeaker = card.example ? (
    <SpeakButton className="opacity-60" tongue={tongue} onSpeak={() => speak(card.example ?? "", rate)} />
  ) : null;

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col gap-3">
      <div className="h-1 overflow-hidden rounded-full bg-[#1e293b]">
        <div
          className="h-full rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative min-h-0 flex-1">
      <div className={`perspective absolute inset-0 ${slide === "next" ? "card-slide-next" : "card-slide-prev"}`} key={card.id}>
        <div className={`card-inner ${flipped ? "is-flipped" : ""}`}>
          <article className="card-face relative flex flex-col items-center justify-center overflow-y-auto rounded-xl border border-slate-800 bg-[#111827] px-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <button type="button" onClick={onFlip} className="flex w-full cursor-pointer flex-col items-center justify-center gap-5 text-center">
              <div className="flex w-full flex-col items-center">
                <p className="text-[11px] tracking-[0.22em] text-slate-500">ITALIANO</p>
                {multi && (
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {available.map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onTense(id);
                        }}
                        className={`rounded-full border px-2.5 py-1 text-[11px] ${
                          id === shownTense ? "border-emerald-400/60 text-emerald-200" : "border-slate-700 text-slate-400"
                        }`}
                      >
                        {TENSE_LABEL[id]}
                      </button>
                    ))}
                  </div>
                )}
                <h2
                  className="mt-3 w-full cursor-pointer text-center text-3xl font-medium tracking-normal text-white"
                  onClick={playWord}
                >
                  {card.italian}
                </h2>
              </div>
              {forms && (
                <div className="mx-auto grid w-full max-w-lg grid-cols-2 gap-x-8 gap-y-4 text-center">
                  {PAIRS.map((person) => (
                    <div key={person.key} className="border-t border-slate-800 pt-2">
                      <p className="text-[11px] tracking-[0.16em] text-slate-500">{person.label}</p>
                      <p className="mt-1 text-base text-slate-100">{forms[person.key]}</p>
                    </div>
                  ))}
                </div>
              )}
              {card.example && (
                <div className="flex w-full justify-center px-2">
                  <p className="inline-flex max-w-full items-center justify-center gap-3 text-center text-lg font-normal leading-relaxed text-slate-200">
                    <span className="text-center">{card.example}</span>
                    {exampleSpeaker}
                  </p>
                </div>
              )}
              <p className="text-xs text-slate-500">{t(tongue, "reveal")}</p>
            </button>
            <CardExtras
              lines={contexts.map((line) => line.italian)}
              hint={hint}
              hintOpen={hintOpen}
              tongue={tongue}
              onToggle={() => setHintOpen((open) => !open)}
              onSpeak={(phrase) => speak(phrase, rate)}
            />
          </article>

          <article className="card-face card-back flex flex-col items-center justify-center overflow-y-auto rounded-xl border border-emerald-400/30 bg-[#111827] px-6 text-center shadow-[0_0_28px_rgba(16,185,129,0.12)]">
            <button
              type="button"
              onClick={onFlip}
              className="flex w-full cursor-pointer flex-col items-center justify-center gap-5 text-center"
            >
              <h2
                className="w-full cursor-pointer text-center text-3xl font-medium tracking-normal text-white"
                onClick={playWord}
              >
                {translationOf(card, tongue)}
              </h2>
              {exampleTranslation && (
                <div className="flex w-full justify-center px-2">
                  <p className="inline-flex max-w-full items-center justify-center gap-3 text-center text-lg font-normal leading-relaxed text-slate-200">
                    <span className="text-center">{exampleTranslation}</span>
                    {exampleSpeaker}
                  </p>
                </div>
              )}
              <p className="text-xs text-slate-500">{t(tongue, "hide")}</p>
            </button>
            <CardExtras
              lines={contexts.map((line) => line.gloss)}
              hint={hint}
              hintOpen={hintOpen}
              tongue={tongue}
              onToggle={() => setHintOpen((open) => !open)}
              onSpeak={(phrase) => speak(contexts.find((line) => line.gloss === phrase)?.italian ?? phrase, rate)}
            />
          </article>
        </div>
      </div>
      </div>
      <div className="mx-auto flex h-11 shrink-0 items-center gap-1 rounded-full border border-slate-700 bg-[#111827] px-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
        <button
          type="button"
          aria-label={t(tongue, "speak")}
          onClick={() => speak(card.italian, rate)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-100"
        >
          <Volume2 className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <span className="h-4 w-px bg-slate-700" />
        {([1, 0.7] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => chooseRate(value)}
            className={`h-8 rounded-full px-2.5 text-xs ${rate === value ? "bg-emerald-500 text-slate-950" : "text-slate-400"}`}
          >
            {value === 1 ? "1.0×" : "0.7×"}
          </button>
        ))}
      </div>
    </section>
  );
}

function CardExtras({
  lines,
  hint,
  hintOpen,
  tongue,
  onToggle,
  onSpeak,
}: {
  lines: string[];
  hint: string[];
  hintOpen: boolean;
  tongue: MotherTongue;
  onToggle: () => void;
  onSpeak: (phrase: string) => void;
}) {
  return (
    <div className="mt-4 flex w-full flex-col items-center gap-2 text-center">
      {lines.length > 0 && <section className="rounded-xl border border-slate-800 bg-[#0f172a] px-3 py-3">
        <p className="text-[11px] tracking-[0.16em] text-emerald-400">КОНТЕКСТ AI</p>
        <ul className="mt-2 flex flex-col gap-2">
          {lines.map((line) => (
            <li key={line} className="flex items-center justify-between gap-2">
              <span className="text-sm leading-snug text-slate-200">{line}</span>
              <SpeakButton tongue={tongue} onSpeak={() => onSpeak(line)} />
            </li>
          ))}
        </ul>
      </section>}
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex min-h-10 items-center gap-2 self-center rounded-full border border-slate-700 px-3 text-xs text-slate-300"
      >
        <Sparkles className="h-3.5 w-3.5 text-emerald-300/80" />
        {t(tongue, "grammar")}
      </button>
      {hintOpen && (
        <ul className="rounded-xl border border-slate-800 bg-[#0f172a] px-3 py-2.5">
          {hint.map((item) => (
            <li key={item} className="py-0.5 text-sm font-normal leading-relaxed text-slate-300">{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
