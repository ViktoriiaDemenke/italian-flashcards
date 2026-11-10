import { useEffect, useMemo, useState } from "react";
import { AudioLines, RotateCcw } from "lucide-react";
import { CardNav } from "./components/CardNav";
import { CategoryBar, filterLabel } from "./components/CategoryBar";
import { Flashcard } from "./components/Flashcard";
import { Header } from "./components/Header";
import { QuizCard } from "./components/QuizCard";
import { StatsDrawer } from "./components/StatsDrawer";
import { cardsFor, DECK, selectionForLevel } from "./data/deck";
import { loadSession, nextStudy, saveSession, streakOnView } from "./lib/session";
import { gradedLine, t } from "./lib/ui";
import type { FilterId, GradeId, Level, MotherTongue, StudyMode, TenseId, TopicId } from "./types";

const DAILY_GOAL = 20;
const LEVEL_IDS: Level[] = ["A1", "A2", "B1", "B2"];

const SPLASH_COUNT = 12;

function splashSlots(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;
    const left = 50 + Math.cos(angle) * 40;
    const top = 50 + Math.sin(angle) * 36;
    return {
      top: `${top}%`,
      left: `${left}%`,
      x: `${Math.round(Math.cos(angle) * 12)}px`,
      y: `${Math.round(Math.sin(angle) * 12)}px`,
      delay: `${(index * 0.1).toFixed(2)}s`,
      peak: (0.72 + (index % 4) * 0.07).toFixed(2),
      scale: (0.92 + (index % 3) * 0.04).toFixed(2),
    };
  });
}

function splashCards(tongue: MotherTongue) {
  const pool = [...DECK];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = pool[i];
    pool[i] = pool[j];
    pool[j] = swap;
  }
  const slots = splashSlots(Math.min(SPLASH_COUNT, pool.length));
  return pool.slice(0, slots.length).map((card, index) => ({
    id: card.id,
    italian: card.italian,
    translation: card.translation[tongue],
    slot: slots[index],
  }));
}

export default function App() {
  const stored = loadSession();
  const [level, setLevel] = useState<Level>(stored.level);
  const [tongue, setTongue] = useState<MotherTongue>(stored.tongue);
  const initial = selectionForLevel(stored.level);
  const [filter, setFilter] = useState<FilterId>(initial.filter);
  const [topic, setTopic] = useState<TopicId | null>(initial.topic);
  const [mode, setMode] = useState<StudyMode>("cards");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [tense, setTense] = useState<TenseId>("presente");
  const [complete, setComplete] = useState(false);
  const [statsOpen, setStatsOpen] = useState(true);
  const [cardsToday, setCardsToday] = useState(stored.cardsToday);
  const [streak, setStreak] = useState(stored.streak);
  const [lastStudyDay, setLastStudyDay] = useState<string | null>(stored.lastStudyDay);
  const [counts, setCounts] = useState({ again: 0, hard: 0, good: 0, easy: 0 });
  const [savedIds, setSavedIds] = useState<string[]>(stored.savedIds);
  const [slide, setSlide] = useState<"next" | "prev">("next");
  const [splash, setSplash] = useState<"hold" | "fade" | "done">("hold");
  const [floating] = useState(() => splashCards(stored.tongue));

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setSplash("fade"), 3600);
    const doneTimer = window.setTimeout(() => setSplash("done"), 4300);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  useEffect(() => {
    saveSession({ level, tongue, savedIds, streak, lastStudyDay, cardsToday });
  }, [level, tongue, savedIds, streak, lastStudyDay, cardsToday]);

  const deck = useMemo(() => cardsFor(level, filter, topic), [level, filter, topic]);

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

  function markStudied() {
    const next = nextStudy({ streak, lastStudyDay, cardsToday });
    setStreak(next.streak);
    setLastStudyDay(next.lastStudyDay);
    setCardsToday(next.cardsToday);
  }

  function advance(result: GradeId) {
    setCounts((current) => ({ ...current, [result]: current[result] + 1 }));
    markStudied();
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
    if (delta > 0) markStudied();
  }

  const levelProgress = useMemo(() => {
    const totals = { A1: 0, A2: 0, B1: 0, B2: 0 };
    for (const item of DECK) totals[item.level] += 1;
    const saved = { A1: 0, A2: 0, B1: 0, B2: 0 };
    const savedSet = new Set(savedIds);
    for (const item of DECK) {
      if (savedSet.has(item.id)) saved[item.level] += 1;
    }
    return Object.fromEntries(LEVEL_IDS.map((id) => [id, { total: totals[id], saved: saved[id] }])) as Record<
      Level,
      { total: number; saved: number }
    >;
  }, [savedIds]);

  function toggleSaved() {
    if (!card) return;
    setSavedIds((current) =>
      current.includes(card.id) ? current.filter((id) => id !== card.id) : [...current, card.id],
    );
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      {splash !== "done" && (
        <div className={`launch-splash ${splash === "fade" ? "is-fading" : ""}`} aria-hidden={splash === "fade"}>
          {floating.map((item) => (
            <div
              key={item.id}
              className="launch-float"
              style={{
                top: item.slot.top,
                left: item.slot.left,
                animationDelay: item.slot.delay,
                ["--drift-x" as string]: item.slot.x,
                ["--drift-y" as string]: item.slot.y,
                ["--peak" as string]: item.slot.peak,
                ["--scale" as string]: item.slot.scale,
              }}
            >
              <strong>{item.italian}</strong>
              <span>{item.translation}</span>
            </div>
          ))}
          <div className="launch-mark">
            <AudioLines className="launch-wave" strokeWidth={1.5} aria-hidden />
            <p className="launch-word">Parliamo</p>
          </div>
        </div>
      )}
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
        <Header
          streak={streakOnView({ streak, lastStudyDay })}
          cardsToday={cardsToday}
          dailyGoal={DAILY_GOAL}
          saved={savedCount}
          progress={levelProgress}
          level={level}
          tongue={tongue}
          onLevel={(next) => {
            const nextSelection = selectionForLevel(next);
            setLevel(next);
            setFilter(nextSelection.filter);
            setTopic(nextSelection.topic);
            resetPosition();
          }}
          onTongue={setTongue}
        />
        <CategoryBar
          level={level}
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
                  subtitle={filterLabel(level, filter, topic, tongue)}
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
                  subtitle={filterLabel(level, filter, topic, tongue)}
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
