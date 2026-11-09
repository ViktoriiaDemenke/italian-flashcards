import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { CategoryBar, filterLabel } from "./components/CategoryBar";
import { Flashcard } from "./components/Flashcard";
import { GradeBar } from "./components/GradeBar";
import { Header } from "./components/Header";
import { QuizCard } from "./components/QuizCard";
import { StatsDrawer } from "./components/StatsDrawer";
import { DECK } from "./data/deck";
import type { FilterId, GradeId, Level, SourceLang, StudyMode, TenseId, TopicId } from "./types";

const DAILY_GOAL = 20;

export default function App() {
  const [level, setLevel] = useState<Level>("A1");
  const [source, setSource] = useState<SourceLang>("en-GB");
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

  const deck = useMemo(
    () =>
      DECK.filter((card) => {
        if (card.level !== level) return false;
        if (filter === "quick") return true;
        if (card.category !== filter) return false;
        if (topic && card.topic !== topic) return false;
        return true;
      }),
    [level, filter, topic],
  );

  const card = deck[index];
  const mastered = counts.good + counts.easy;
  const toRepeat = counts.again + counts.hard;
  const graded = mastered + toRepeat;
  const accuracy = graded === 0 ? 0 : Math.round((mastered / graded) * 100);

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

  function grade(result: GradeId) {
    if (!flipped || !card || mode !== "cards") return;
    advance(result);
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
        <Header
          streak={0}
          cardsToday={cardsToday}
          dailyGoal={DAILY_GOAL}
          level={level}
          source={source}
          onLevel={(next) => {
            setLevel(next);
            resetPosition();
          }}
          onSource={setSource}
        />
        <CategoryBar
          value={filter}
          topic={topic}
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
              Flashcards
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
              Quiz Mode
            </button>
          </div>
        </div>

        {complete || !card ? (
          <section className="flex flex-1 flex-col items-center justify-center rounded-xl border border-slate-800 bg-[#111827] px-6 py-16 text-center">
            <p className="text-xs tracking-[0.2em] text-emerald-400">SESSION</p>
            <h2 className="mt-3 text-3xl font-semibold">
              {card ? "Session complete" : "No cards at this level"}
            </h2>
            <p className="mt-3 max-w-md text-sm text-slate-400">
              {card
                ? `You graded ${deck.length} cards in this pass. Accuracy is ${accuracy}%.`
                : "Choose another level or category to keep studying."}
            </p>
            {card && (
              <button
                type="button"
                onClick={resetPosition}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950"
              >
                <RotateCcw className="h-4 w-4" />
                Study again
              </button>
            )}
          </section>
        ) : (
          <>
            {mode === "cards" ? (
              <>
                <Flashcard
                  card={card}
                  index={index}
                  total={deck.length}
                  subtitle={filterLabel(filter, topic)}
                  flipped={flipped}
                  tense={tense}
                  source={source}
                  onFlip={() => setFlipped((current) => !current)}
                  onTense={setTense}
                />
                <GradeBar enabled={flipped} onGrade={grade} />
              </>
            ) : (
              <QuizCard
                card={card}
                index={index}
                total={deck.length}
                subtitle={filterLabel(filter, topic)}
                source={source}
                pool={deck}
                onAnswer={(correct) => advance(correct ? "good" : "again")}
              />
            )}
          </>
        )}

        <div className="mt-auto">
          <StatsDrawer
            open={statsOpen}
            onToggle={() => setStatsOpen((current) => !current)}
            mastered={mastered}
            toRepeat={toRepeat}
            accuracy={accuracy}
          />
        </div>
      </div>
    </main>
  );
}
