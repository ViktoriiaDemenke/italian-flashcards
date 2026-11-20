import { useEffect, useMemo, useRef, useState } from "react";
import { AudioLines, ChevronLeft, Sparkles } from "lucide-react";
import { CardNav } from "./components/CardNav";
import { Dashboard } from "./components/Dashboard";
import { RoleplayScreen } from "./components/RoleplayScreen";
import { filterLabel } from "./components/CategoryBar";
import { TopicsScreen } from "./components/TopicsScreen";
import { Flashcard } from "./components/Flashcard";
import { QuizCard } from "./components/QuizCard";
import { cardsFor, categoryCards, DECK, selectionForLevel } from "./data/deck";
import { cardsByIds } from "./lib/mix";
import { loadSession, nextStudy, saveSession, streakOnView, topicKey, type Resume, type TopicProgress } from "./lib/session";
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
  const pending = stored.resume;
  const [level, setLevel] = useState<Level>(pending?.level ?? stored.level);
  const [studying, setStudying] = useState(Boolean(pending?.active));
  const [browsing, setBrowsing] = useState(false);
  const [tongue] = useState<MotherTongue>(stored.tongue);
  const initial = selectionForLevel(pending?.level ?? stored.level);
  const [filter, setFilter] = useState<FilterId>(pending?.filter ?? initial.filter);
  const [topic, setTopic] = useState<TopicId | null>(pending?.topic ?? initial.topic);
  const [mode, setMode] = useState<StudyMode>(pending?.section === "test" ? "quiz" : "cards");
  const [index, setIndex] = useState(pending?.cardIndex ?? 0);
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
  const [customIds, setCustomIds] = useState<string[] | null>(pending?.customIds ?? null);
  const [customTitle, setCustomTitle] = useState<string | null>(pending?.customTitle ?? null);
  const [held, setHeld] = useState<Resume | null>(null);
  const topicProgress = useRef<Record<string, TopicProgress>>(stored.topicProgress);
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

  if (studying && !complete && !customIds) {
    topicProgress.current = {
      ...topicProgress.current,
      [topicKey(level, filter, topic)]: { section: mode === "quiz" ? "test" : "cards", cardIndex: index },
    };
  }

  const snapshot = useRef(stored);
  snapshot.current = {
    level,
    tongue,
    savedIds,
    repeatIds,
    studiedIds,
    streak,
    lastStudyDay,
    cardsToday,
    activity,
    resume: studying && !complete
      ? {
          active: true,
          moduleId: customTitle ?? String(filter),
          section: mode === "quiz" ? "test" : "cards",
          cardIndex: index,
          level,
          filter,
          topic,
          customIds,
          customTitle,
        }
      : complete ? null : held,
    topicProgress: topicProgress.current,
  };

  useEffect(() => {
    saveSession(snapshot.current);
  }, [level, tongue, savedIds, repeatIds, studiedIds, streak, lastStudyDay, cardsToday, activity, studying, complete, mode, index, filter, topic, customIds, customTitle, held]);

  useEffect(() => {
    const flush = () => saveSession(snapshot.current);
    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  const deck = useMemo(() => {
    if (customIds) {
      const custom = cardsByIds(customIds);
      if (custom.length > 0) return custom;
    }
    const exact = cardsFor(level, filter, topic);
    if (exact.length > 0) return exact;
    return categoryCards(level, filter, topic);
  }, [customIds, level, filter, topic]);

  useEffect(() => {
    const exact = customIds ? cardsByIds(customIds) : cardsFor(level, filter, topic);
    if (deck.length === 0) return;
    if (exact.length === 0 || index >= deck.length) setIndex(0);
  }, [customIds, level, filter, topic, deck.length, index]);

  const card = deck[index];
  const saved = card ? savedIds.includes(card.id) : false;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [studying, browsing, roleplay, index, mode, card?.id]);

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
    if (again && mode === "quiz") setWeakIds((current) => (current.includes(id) ? current : [...current, id]));
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
          canContinue={Boolean(held)}
          onContinue={() => {
            setHeld(null);
            setBrowsing(false);
            setStudying(true);
            setComplete(false);
          }}
          onLevel={(next) => {
            setHeld(null);
            setCustomIds(null);
            setCustomTitle(null);
            setBrowsing(true);
            setStudying(false);
            setLevel(next);
            setMode("cards");
          }}
          onStartMix={(ids) => {
            setHeld(null);
            setCustomIds(ids);
            setCustomTitle(t(tongue, "dailyMix"));
            setBrowsing(false);
            setStudying(true);
            setMode("cards");
            setWeakIds([]);
            resetPosition();
          }}
        />
      )}
      {splash === "done" && browsing && !studying && (
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
              const cards = cardsFor(level, next, null);
              const safe = cards.length > 0 ? cards : categoryCards(level, next, null);
              const saved = topicProgress.current[topicKey(level, next, null)];
              setHeld(null);
              setCustomIds(null);
              setCustomTitle(null);
              setFilter(next);
              setTopic(null);
              setStudying(true);
              setWeakIds([]);
              setMode(saved?.section === "test" ? "quiz" : "cards");
              setIndex(saved && saved.cardIndex < safe.length ? saved.cardIndex : 0);
              setFlipped(false);
              setComplete(false);
              setTense("presente");
            }}
          />
        </div>
      )}
      {splash === "done" && studying && (
      <div className="fixed inset-0 z-30 mx-auto flex h-dvh w-full max-w-3xl flex-col gap-4 overflow-hidden bg-[#0f172a] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (!complete) setHeld(snapshot.current.resume);
              setStudying(false);
              setBrowsing(!customIds);
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

        {studying && (complete || deck.length === 0 ? (
          <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-slate-800 bg-[#111827] px-6 py-16 text-center">
            <h2 className="text-3xl font-medium">
              {deck.length > 0 ? t(tongue, "complete") : t(tongue, "empty")}
            </h2>
            {card && mode === "quiz" && (
              <p className="text-sm text-slate-400">
                {deck.length} {t(tongue, "cardsWord")} · {weakIds.length} {t(tongue, "missedWord")}
              </p>
            )}
            {deck.length === 0 && <p className="max-w-md text-sm text-slate-400">{t(tongue, "keep")}</p>}
            {deck.length > 0 && mode === "cards" && (
              <button
                type="button"
                onClick={() => {
                  setWeakIds([]);
                  setMode("quiz");
                  resetPosition();
                }}
                className="mt-4 min-h-12 min-w-56 rounded-xl bg-emerald-500 px-5 text-sm font-medium text-slate-950"
              >
                {t(tongue, "quiz")}
              </button>
            )}
            {card && mode === "quiz" && (
              <button
                type="button"
                onClick={() => {
                  setHeld(null);
                  setCustomIds(null);
                  setCustomTitle(null);
                  setStudying(false);
                  setBrowsing(true);
                  window.scrollTo(0, 0);
                }}
                className="mt-4 min-h-12 min-w-56 rounded-xl bg-emerald-500 px-5 text-sm font-medium text-slate-950"
              >
                {t(tongue, "allTopics")}
              </button>
            )}
            {deck.length > 0 && mode === "quiz" && weakIds.length > 0 && (
              <button
                type="button"
                onClick={startWeakReview}
                className="inline-flex min-h-12 min-w-56 items-center justify-center gap-2 rounded-xl border border-emerald-300/80 bg-emerald-400/10 px-5 text-sm font-medium text-emerald-100 shadow-[0_0_24px_rgba(110,231,183,0.35)]"
              >
                <Sparkles className="h-4 w-4" />
                AI Розбір Слабких Місць ({weakIds.length})
              </button>
            )}
          </section>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col justify-between gap-3">
            <div className="card-stage flex min-h-0 flex-1 flex-col">
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
                  slide={slide}
                />
              ) : (
                <QuizCard
                  card={card}
                  index={index}
                  total={deck.length}
                  subtitle={filterLabel(level, filter, topic, tongue)}
                  tongue={tongue}
                  pool={deck}
                  slide={slide}
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
