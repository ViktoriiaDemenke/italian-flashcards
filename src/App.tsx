import { useEffect, useMemo, useState } from "react";
import { AudioLines, ChevronLeft, RotateCcw, Sparkles } from "lucide-react";
import { CardNav } from "./components/CardNav";
import { Dashboard } from "./components/Dashboard";
import { RoleplayScreen } from "./components/RoleplayScreen";
import { filterLabel } from "./components/CategoryBar";
import { TopicsScreen } from "./components/TopicsScreen";
import { Flashcard } from "./components/Flashcard";
import { QuizCard } from "./components/QuizCard";
import { cardsFor, DECK, selectionForLevel } from "./data/deck";
import { cardsByIds } from "./lib/mix";
import { loadSession, nextStudy, saveSession, streakOnView } from "./lib/session";
import { t } from "./lib/ui";
import type { FilterId, GradeId, Level, MotherTongue, StudyMode, TenseId, TopicId } from "./types";

const SPLASH_COUNT = 8;

const SPLASH_SLOTS = [
  { top: "10%", left: "50%", fade: "0.95" },
  { top: "28%", left: "20%", fade: "0.42" },
  { top: "28%", left: "80%", fade: "0.9" },
  { top: "50%", left: "16%", fade: "0.82" },
  { top: "50%", left: "84%", fade: "0.88" },
  { top: "72%", left: "20%", fade: "0.78" },
  { top: "72%", left: "80%", fade: "0.92" },
  { top: "90%", left: "50%", fade: "0.62" },
];

function splashCards(tongue: MotherTongue) {
  const short = DECK.filter((card) => card.italian.length <= 18 && card.translation[tongue].length <= 22);
  const pool = short.length >= SPLASH_COUNT ? short : [...DECK];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = pool[i];
    pool[i] = pool[j];
    pool[j] = swap;
  }
  return pool.slice(0, SPLASH_COUNT).map((card, index) => ({
    id: card.id,
    italian: card.italian,
    translation: card.translation[tongue],
    slot: SPLASH_SLOTS[index],
  }));
}

export default function App() {
  const stored = loadSession();
  const [level, setLevel] = useState<Level>(stored.level);
  const [studying, setStudying] = useState(false);
  const [browsing, setBrowsing] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [tongue] = useState<MotherTongue>(stored.tongue);
  const initial = selectionForLevel(stored.level);
  const [filter, setFilter] = useState<FilterId>(initial.filter);
  const [topic, setTopic] = useState<TopicId | null>(initial.topic);
  const [mode, setMode] = useState<StudyMode>("cards");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [tense, setTense] = useState<TenseId>("presente");
  const [complete, setComplete] = useState(false);
  const [cardsToday, setCardsToday] = useState(stored.cardsToday);
  const [activity, setActivity] = useState<Record<string, number>>(stored.activity);
  const [roleplay, setRoleplay] = useState(false);
  const [weakIds, setWeakIds] = useState<string[]>([]);
  const [streak, setStreak] = useState(stored.streak);
  const [lastStudyDay, setLastStudyDay] = useState<string | null>(stored.lastStudyDay);
  const [savedIds, setSavedIds] = useState<string[]>(stored.savedIds);
  const [repeatIds, setRepeatIds] = useState<string[]>(stored.repeatIds);
  const [studiedIds, setStudiedIds] = useState<string[]>(stored.studiedIds);
  const [customIds, setCustomIds] = useState<string[] | null>(null);
  const [customTitle, setCustomTitle] = useState<string | null>(null);
  const [slide, setSlide] = useState<"next" | "prev">("next");
  const [splash, setSplash] = useState<"hold" | "fade" | "done">("hold");
  const [floating] = useState(() => splashCards(stored.tongue));

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setSplash("fade"), 2800);
    const doneTimer = window.setTimeout(() => setSplash("done"), 3500);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  useEffect(() => {
    saveSession({ level, tongue, savedIds, repeatIds, studiedIds, streak, lastStudyDay, cardsToday, activity });
  }, [level, tongue, savedIds, repeatIds, studiedIds, streak, lastStudyDay, cardsToday, activity]);

  const deck = useMemo(
    () => (customIds ? cardsByIds(customIds) : cardsFor(level, filter, topic)),
    [customIds, level, filter, topic],
  );

  const card = deck[index];
  const saved = card ? savedIds.includes(card.id) : false;

  useEffect(() => {
    if (!studying) return;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [studying, index, mode, card?.id]);

  function resetPosition() {
    setIndex(0);
    setFlipped(false);
    setComplete(false);
    setTense("presente");
  }

  function markStudied() {
    const next = nextStudy({ streak, lastStudyDay, cardsToday, activity });
    setStreak(next.streak);
    setLastStudyDay(next.lastStudyDay);
    setCardsToday(next.cardsToday);
    setActivity(next.activity);
  }

  function remember(id: string, again: boolean) {
    setStudiedIds((current) => (current.includes(id) ? current : [...current, id]));
    setRepeatIds((current) => {
      if (again) return current.includes(id) ? current : [...current, id];
      return current.filter((item) => item !== id);
    });
    if (again) setWeakIds((current) => (current.includes(id) ? current : [...current, id]));
  }

  function advance(result: GradeId) {
    if (card) remember(card.id, result === "again");
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
    if (delta > 0 && index + 1 >= deck.length) {
      if (card) {
        remember(card.id, false);
        markStudied();
      }
      setComplete(true);
      setFlipped(false);
      return;
    }
    if (next < 0 || next >= deck.length) return;
    setSlide(delta > 0 ? "next" : "prev");
    setIndex(next);
    setFlipped(false);
    setTense("presente");
    if (delta > 0 && card) {
      remember(card.id, false);
      markStudied();
    }
  }

  function toggleSaved() {
    if (!card) return;
    const marked = savedIds.includes(card.id);
    setSavedIds((current) => (marked ? current.filter((id) => id !== card.id) : [...current, card.id]));
    if (!marked) setWeakIds((current) => (current.includes(card.id) ? current : [...current, card.id]));
  }

  function startWeakReview() {
    if (weakIds.length === 0) return;
    setCustomIds(weakIds);
    setCustomTitle("AI Розбір Слабких Місць");
    setMode("cards");
    resetPosition();
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      {splash !== "done" && (
        <div className={`launch-splash ${splash === "fade" ? "is-fading" : ""}`} aria-hidden={splash === "fade"}>
          <div className="launch-orbit">
            {floating.map((item) => (
              <div
                key={item.id}
                className="launch-float"
                style={{
                  top: item.slot.top,
                  left: item.slot.left,
                  ["--fade" as string]: item.slot.fade,
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
        </div>
      )}
      {splash === "done" && !browsing && !studying && roleplay && (
        <RoleplayScreen level={level} tongue={tongue} onClose={() => setRoleplay(false)} />
      )}
      {splash === "done" && !browsing && !studying && !roleplay && (
        <Dashboard
          level={level}
          tongue={tongue}
          streak={streakOnView({ streak, lastStudyDay })}
          cardsToday={cardsToday}
          activity={activity}
          studiedIds={studiedIds}
          repeatIds={repeatIds}
          savedIds={savedIds}
          onRoleplay={() => setRoleplay(true)}
          onLevel={(next) => {
            setCustomIds(null);
            setCustomTitle(null);
            setReviewing(false);
            setBrowsing(true);
            setStudying(false);
            setLevel(next);
            setMode("cards");
          }}
          onStartMix={(ids) => {
            setCustomIds(ids);
            setCustomTitle("Smart Daily Mix");
            setReviewing(false);
            setBrowsing(false);
            setStudying(true);
            setMode("cards");
            setWeakIds([]);
            resetPosition();
          }}
          onStartGenerated={(ids, title) => {
            setCustomIds(ids);
            setCustomTitle(title);
            setReviewing(false);
            setBrowsing(false);
            setStudying(true);
            setMode("cards");
            setWeakIds([]);
            resetPosition();
          }}
        />
      )}
      {splash === "done" && browsing && !studying && !reviewing && (
        <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-4 px-4 pb-6 pt-3">
          <button
            type="button"
            onClick={() => setBrowsing(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-[#111827] text-slate-100"
            aria-label={t(tongue, "back")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <TopicsScreen
            level={level}
            tongue={tongue}
            studiedIds={studiedIds}
            repeatIds={repeatIds}
            onSelect={(next) => {
              setCustomIds(null);
              setCustomTitle(null);
              setFilter(next);
              setTopic(null);
              setReviewing(false);
              setStudying(true);
              setMode("cards");
              setWeakIds([]);
              resetPosition();
            }}
            onGenerate={(ids, title) => {
              setCustomIds(ids);
              setCustomTitle(title);
              setReviewing(false);
              setBrowsing(false);
              setStudying(true);
              setMode("cards");
              setWeakIds([]);
              resetPosition();
            }}
          />
        </div>
      )}
      {splash === "done" && browsing && !studying && reviewing && (
        <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-4 px-4 pb-6 pt-3">
          <button
            type="button"
            onClick={() => setReviewing(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-[#111827] text-slate-100"
            aria-label={t(tongue, "back")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-medium text-white">{filterLabel(level, filter, topic, tongue)}</h1>
          <div className="grid grid-cols-2 gap-3">
            <article className="rounded-2xl border border-slate-800 bg-[#111827] px-4 py-4">
              <p className="text-sm text-slate-400">{t(tongue, "studied")}</p>
              <p className="mt-2 text-2xl font-medium text-white">{deck.filter((item) => studiedIds.includes(item.id)).length}/{deck.length}</p>
            </article>
            <article className="rounded-2xl border border-slate-800 bg-[#111827] px-4 py-4">
              <p className="text-sm text-slate-400">{t(tongue, "saved")}</p>
              <p className="mt-2 text-2xl font-medium text-white">{deck.filter((item) => savedIds.includes(item.id)).length}</p>
            </article>
            <article className="col-span-2 rounded-2xl border border-slate-800 bg-[#111827] px-4 py-4">
              <p className="text-sm text-slate-400">{t(tongue, "repeat")}</p>
              <p className="mt-2 text-2xl font-medium text-white">{deck.filter((item) => repeatIds.includes(item.id)).length}</p>
            </article>
          </div>
          <button
            type="button"
            onClick={() => {
              setMode("cards");
              setComplete(false);
              setStudying(true);
            }}
            className="min-h-12 rounded-xl border border-slate-700 bg-[#111827] text-sm font-medium text-white"
          >
            {t(tongue, "flashcards")}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("quiz");
              resetPosition();
              setStudying(true);
            }}
            className="min-h-12 rounded-xl bg-emerald-500 text-sm font-medium text-slate-950"
          >
            {t(tongue, "quiz")}
          </button>
        </div>
      )}
      {splash === "done" && studying && (
      <div className="fixed inset-0 z-30 mx-auto flex h-dvh w-full max-w-3xl flex-col gap-4 overflow-hidden bg-[#0f172a] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setStudying(false);
              if (customIds) {
                setReviewing(false);
                setBrowsing(false);
                return;
              }
              setReviewing(true);
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-[#111827] text-slate-100"
            aria-label={t(tongue, "back")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-medium text-white">{customTitle ?? filterLabel(level, filter, topic, tongue)}</h1>
            <p className="text-xs text-slate-400">{card ? `${index + 1} / ${deck.length}` : deck.length}</p>
          </div>
        </header>

        {studying && (complete || !card ? (
          <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-slate-800 bg-[#111827] px-6 py-16 text-center">
            <h2 className="text-3xl font-medium">
              {card ? t(tongue, "complete") : t(tongue, "empty")}
            </h2>
            {card && (
              <p className="text-sm text-slate-400">
                {deck.length} {tongue === "uk" ? "карток" : "cards"} · {tongue === "uk" ? "серія" : "streak"} {streakOnView({ streak, lastStudyDay })} · {weakIds.length} {tongue === "uk" ? "слабких" : "weak"}
              </p>
            )}
            {!card && <p className="max-w-md text-sm text-slate-400">{t(tongue, "keep")}</p>}
            {card && (
              <button
                type="button"
                disabled={weakIds.length === 0}
                onClick={startWeakReview}
                className="mt-4 inline-flex min-h-12 min-w-56 items-center justify-center gap-2 rounded-xl border border-emerald-400 bg-emerald-500 px-5 text-sm font-medium text-slate-950 shadow-[0_0_24px_rgba(16,185,129,0.28)] disabled:border-slate-700 disabled:bg-[#0f172a] disabled:text-slate-500 disabled:shadow-none"
              >
                <Sparkles className="h-4 w-4" />
                AI Розбір Слабких Місць
              </button>
            )}
            {card && mode === "cards" && (
              <button
                type="button"
                onClick={() => {
                  setMode("quiz");
                  resetPosition();
                }}
                className={`min-h-12 min-w-56 rounded-xl px-5 text-sm font-medium ${
                  weakIds.length === 0
                    ? "border border-emerald-400 bg-emerald-500 text-slate-950 shadow-[0_0_24px_rgba(16,185,129,0.28)]"
                    : "border border-slate-700 bg-[#0f172a] text-white"
                }`}
              >
                {t(tongue, "quiz")}
              </button>
            )}
            {card && (
              <button
                type="button"
                onClick={resetPosition}
                className="inline-flex min-h-12 min-w-56 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-[#0f172a] px-5 text-sm font-medium text-white"
              >
                <RotateCcw className="h-4 w-4" />
                {t(tongue, "againBtn")}
              </button>
            )}
          </section>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col justify-between gap-3">
            <div className={`card-stage flex min-h-0 flex-1 flex-col ${slide === "next" ? "card-slide-next" : "card-slide-prev"}`} key={`${mode}-${card.id}-${slide}`}>
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
              canNext={mode === "cards" || index + 1 < deck.length}
              saved={saved}
              onPrev={() => step(-1)}
              onNext={() => step(1)}
              onSave={toggleSaved}
            />
          </div>
        ))}

      </div>
      )}
    </main>
  );
}
