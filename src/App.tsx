import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { CardNav } from "./components/CardNav";
import { CategoryBar, filterLabel } from "./components/CategoryBar";
import { Flashcard } from "./components/Flashcard";
import { Header } from "./components/Header";
import { QuizCard } from "./components/QuizCard";
import { StatsDrawer } from "./components/StatsDrawer";
import { DECK } from "./data/deck";
import { gradedLine, t } from "./lib/ui";
import type { FilterId, GradeId, Level, MotherTongue, StudyMode, TenseId, TopicId } from "./types";

const DAILY_GOAL = 20;

export default function App() {
  const [level, setLevel] = useState<Level>("A1");
  const [tongue, setTongue] = useState<MotherTongue>("uk");
  const [filter, setFilter] = useState<FilterId>("quick");
  const [topic, setTopic] = useState<TopicId | null>(null);
  const [mode, setMode] = useState<StudyMode>("cards");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [tense, setTense] = useState<TenseId>("presente");
  const [complete, setComplete] = useState(false);
  const [statsOpen, setStatsOpen] = useState(true);
  const [cardsToday, setCardsToday] = useState(0);
  const [counts, setCounts] = useState({ again: 0, hard: 0, good: 0, easy: 0 });
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [slide, setSlide] = useState<"next" | "prev">("next");

  const deck = useMemo(
    () =>
      DECK.filter((card) => {
        if (filter === "quick") return true;
        if (card.category !== filter) return false;
        if (topic && card.topic !== topic) return false;
        return true;
      }),
    [level, filter, topic],
  );

  const card = deck[index];
  const mastered = counts.good + counts.easy;
  const graded = mastered + counts.again + counts.hard;
  const accuracy = graded === 0 ? 0 : Math.round((mastered / graded) * 100);
  const savedCount = savedIds.length;
  const saved = card ? savedIds.includes(card.id) : false;

  function resetPosition() {
    setIndex(0);
    setFlipped(false);
    setComplete(false);
    setTense("presente");
  }

  function advance(result: GradeId) {
    setCounts((current) => ({ ...current, [result]: current[result] + 1 }));
    setCardsToday((current) => current + 1);
    if (index + 1 >= deck.length) {
      setComplete(true);
      setFlipped(false);
      return;
    }
    setIndex((current) => current + 1);
    setFlipped(false);
    setTense("presente");
  }

  function step(delta: -1 | 1) {
    const next = index + delta;
    if (next < 0 || next >= deck.length) return;
    setSlide(delta > 0 ? "next" : "prev");
    setIndex(next);
    setFlipped(false);
    setTense("presente");
    if (delta > 0) setCardsToday((current) => current + 1);
  }

  function toggleSaved() {
    if (!card) return;
    setSavedIds((current) =>
      current.includes(card.id) ? current.filter((id) => id !== card.id) : [...current, card.id],
    );
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
        <Header
          streak={0}
          cardsToday={cardsToday}
          dailyGoal={DAILY_GOAL}
          level={level}
          tongue={tongue}
          onLevel={(next) => {
            setLevel(next);
            resetPosition();
          }}
          onTongue={setTongue}
        />
        <CategoryBar
          value={filter}
          topic={topic}
          tongue={tongue}
          onChange={(next, nextTopic) => {
            setFilter(next);
            setTopic(nextTopic);
            resetPosition();
          }}
        />

        <div className="flex justify-end">
          <div className="inline-flex rounded-full border border-slate-700 bg-[#111827] p-0.5" role="group" aria-label="Study mode">
            <button
              type="button"
              aria-pressed={mode === "cards"}
              onClick={() => {
                setMode("cards");
                setFlipped(false);
              }}
              className={`rounded-full px-3 py-1.5 text-sm ${
                mode === "cards" ? "bg-emerald-500 text-slate-950" : "text-slate-300"
              }`}
            >
              {t(tongue, "flashcards")}
            </button>
            <button
              type="button"
              aria-pressed={mode === "quiz"}
              onClick={() => {
                setMode("quiz");
                setFlipped(false);
              }}
              className={`rounded-full px-3 py-1.5 text-sm ${
                mode === "quiz" ? "bg-emerald-500 text-slate-950" : "text-slate-300"
              }`}
            >
              {t(tongue, "quiz")}
            </button>
          </div>
        </div>

        {complete || !card ? (
          <section className="flex flex-1 flex-col items-center justify-center rounded-xl border border-slate-800 bg-[#111827] px-6 py-16 text-center">
            <p className="text-xs tracking-[0.2em] text-emerald-400">{t(tongue, "session")}</p>
            <h2 className="mt-3 text-3xl font-semibold">
              {card ? t(tongue, "complete") : t(tongue, "empty")}
            </h2>
            <p className="mt-3 max-w-md text-sm text-slate-400">
              {card ? gradedLine(tongue, deck.length, accuracy) : t(tongue, "keep")}
            </p>
            {card && (
              <button
                type="button"
                onClick={resetPosition}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950"
              >
                <RotateCcw className="h-4 w-4" />
                {t(tongue, "againBtn")}
              </button>
            )}
          </section>
        ) : (
          <>
            <div className={slide === "next" ? "card-slide-next" : "card-slide-prev"} key={`${card.id}-${slide}`}>
              {mode === "cards" ? (
                <Flashcard
                  card={card}
                  index={index}
                  total={deck.length}
                  subtitle={filterLabel(filter, topic, tongue)}
                  flipped={flipped}
                  tense={tense}
                  tongue={tongue}
                  onFlip={() => setFlipped((current) => !current)}
                  onTense={setTense}
                />
              ) : (
                <QuizCard
                  card={card}
                  index={index}
                  total={deck.length}
                  subtitle={filterLabel(filter, topic, tongue)}
                  tongue={tongue}
                  pool={deck}
                  onAnswer={(correct) => advance(correct ? "good" : "again")}
                />
              )}
            </div>
            <CardNav
              tongue={tongue}
              canPrev={index > 0}
              canNext={index + 1 < deck.length}
              saved={saved}
              onPrev={() => step(-1)}
              onNext={() => step(1)}
              onSave={toggleSaved}
            />
          </>
        )}

        <div className="mt-auto">
          <StatsDrawer
            open={statsOpen}
            onToggle={() => setStatsOpen((current) => !current)}
            saved={savedCount}
            toRepeat={savedCount}
            tongue={tongue}
          />
        </div>
      </div>
    </main>
  );
}
