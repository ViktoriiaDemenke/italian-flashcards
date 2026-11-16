import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { SpeakButton } from "./SpeakButton";
import { TENSE_LABEL, TENSE_ORDER } from "../data/deck";
import { grammarHint } from "../lib/cardHelp";
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
    document.querySelectorAll(".card-face").forEach((face) => {
      face.scrollTop = 0;
    });
  }, [card.id]);

  const contexts = (card.contextExamples ?? []).map((item) => ({
    italian: item.italian,
    gloss: tongue === "uk" ? item.uk : item.en || item.uk,
  }));
  const hint = grammarHint(card, tongue);

  function chooseRate(next: 1 | 0.7) {
    setRate(next);
    localStorage.setItem("parliamo-rate", String(next));
  }

  const rateToggle = (
    <span className="inline-flex h-11 overflow-hidden rounded-full border border-slate-700 bg-[#0f172a] text-xs">
      {([1, 0.7] as const).map((value) => (
        <button
          key={value}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            chooseRate(value);
          }}
          className={`px-2 ${rate === value ? "bg-emerald-500 text-slate-950" : "text-slate-300"}`}
        >
          {value === 1 ? "1.0×" : "0.7×"}
        </button>
      ))}
    </span>
  );

  const wordSpeaker = <SpeakButton tongue={tongue} onSpeak={() => speak(card.italian, rate)} />;
  const exampleSpeaker = card.example ? (
    <SpeakButton tongue={tongue} onSpeak={() => speak(card.example ?? "", rate)} />
  ) : null;

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="h-1 overflow-hidden rounded-full bg-[#1e293b]">
        <div
          className="h-full rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="perspective min-h-0 flex-1" key={card.id}>
        <div className={`card-inner ${flipped ? "is-flipped" : ""}`}>
          <article className="card-face relative flex flex-col overflow-y-auto rounded-xl border border-slate-800 bg-[#111827] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-8">
            <button type="button" onClick={onFlip} className="flex w-full flex-1 cursor-pointer flex-col items-center justify-center gap-5 text-center">
              <div>
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
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <h2 className="text-3xl font-medium tracking-normal text-white">{card.italian}</h2>
                  {wordSpeaker}
                  {rateToggle}
                </div>
              </div>
              {forms && (
                <div className="mx-auto grid max-w-lg grid-cols-2 gap-x-8 gap-y-4 text-left">
                  {PAIRS.map((person) => (
                    <div key={person.key} className="border-t border-slate-800 pt-2">
                      <p className="text-[11px] tracking-[0.16em] text-slate-500">{person.label}</p>
                      <p className="mt-1 text-base text-slate-100">{forms[person.key]}</p>
                    </div>
                  ))}
                </div>
              )}
              {card.example && (
                <p className="mx-auto flex max-w-md items-center justify-center gap-3 text-center text-lg font-normal leading-relaxed text-slate-200">
                  <span>{card.example}</span>
                  {exampleSpeaker}
                </p>
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

          <article className="card-face card-back flex flex-col overflow-y-auto rounded-xl border border-emerald-400/30 bg-[#111827] p-6 shadow-[0_0_28px_rgba(16,185,129,0.12)] sm:p-8">
            <button
              type="button"
              onClick={onFlip}
              className="flex w-full flex-1 cursor-pointer flex-col items-center justify-center gap-5 text-center"
            >
              <div className="flex items-center justify-center gap-3">
                <h2 className="text-3xl font-medium tracking-normal text-white">{translationOf(card, tongue)}</h2>
                {wordSpeaker}
              </div>
              {exampleTranslation && (
                <p className="mx-auto flex max-w-md items-center justify-center gap-3 text-lg font-normal leading-relaxed text-slate-200">
                  <span>{exampleTranslation}</span>
                  {exampleSpeaker}
                </p>
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
  hint: string;
  hintOpen: boolean;
  tongue: MotherTongue;
  onToggle: () => void;
  onSpeak: (phrase: string) => void;
}) {
  return (
    <div className="mt-4 flex flex-col gap-2 text-left">
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
        className="inline-flex min-h-10 items-center gap-2 self-start rounded-full border border-emerald-400/40 px-3 text-xs text-emerald-200"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {tongue === "uk" ? "Граматика" : "Grammar"}
      </button>
      {hintOpen && <p className="rounded-xl border border-slate-800 bg-[#0f172a] px-3 py-2 text-sm leading-relaxed text-slate-200">{hint}</p>}
    </div>
  );
}
