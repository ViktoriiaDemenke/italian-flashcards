import { useState } from "react";
import {
  BookOpen,
  Brain,
  Briefcase,
  Calendar,
  Car,
  CloudSun,
  Coffee,
  FileText,
  FlaskConical,
  Hash,
  Home,
  Landmark,
  MessageCircle,
  Navigation,
  Newspaper,
  Pill,
  Plane,
  Quote,
  Shirt,
  Smartphone,
  Smile,
  Sofa,
  Sparkles,
  Camera,
  Trees,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { DECK, topicsOnLevel } from "../data/deck";
import { cardsForPhoto, cardsForTheme } from "../lib/mix";
import { t, type UiKey } from "../lib/ui";
import type { CategoryId, Level, MotherTongue } from "../types";

const ICONS: Partial<Record<CategoryId, LucideIcon>> = {
  tempo: Calendar,
  calendar: Calendar,
  tempo_calendario: Calendar,
  home: Home,
  casa: Home,
  numbers: Hash,
  numeri: Hash,
  numeri_ordinali: Hash,
  corpo: Pill,
  famiglia: Users,
  direzione: Navigation,
  mobilita_urbana: Navigation,
  cibo: Coffee,
  ristorante_cucina: Coffee,
  vestiti: Shirt,
  clothes: Shirt,
  shopping: Shirt,
  shopping_taglie: Shirt,
  trasporti: Car,
  transport: Car,
  city: Car,
  verbi: BookOpen,
  verbs: BookOpen,
  nouns: BookOpen,
  adjectives: BookOpen,
  idioms: Quote,
  slang: Quote,
  mobili_pulizia: Sofa,
  meteo_stagioni: CloudSun,
  salute_farmacia: Pill,
  health: Pill,
  salute_mentale: Brain,
  relazioni_carattere: Users,
  professioni_lavoro: Briefcase,
  work: Briefcase,
  lavoro_colloquio: Briefcase,
  economia_lavoro: Briefcase,
  viaggi_hotel: Plane,
  viaggi_imprevisti: Plane,
  sentimenti_emozioni: Smile,
  emotions: Smile,
  tecnologia_social: Smartphone,
  technology: Smartphone,
  social: Smartphone,
  cultura_spettacolo: Quote,
  banca_servizi: Landmark,
  finance: Landmark,
  ambiente_natura: Trees,
  environment: Trees,
  relazioni_conflitti: MessageCircle,
  problemi_riparazioni: Wrench,
  rent: Wrench,
  bureaucracy: FileText,
  diritto_contratti: FileText,
  society: Newspaper,
  media_opinione: Newspaper,
  scienza_ricerca: FlaskConical,
};

type TopicsScreenProps = {
  level: Level;
  tongue: MotherTongue;
  studiedIds: string[];
  repeatIds: string[];
  onSelect: (category: CategoryId) => void;
  onGenerate: (ids: string[], title: string) => void;
};

export function TopicsScreen({ level, tongue, studiedIds, repeatIds, onSelect, onGenerate }: TopicsScreenProps) {
  const categories: CategoryId[] = [];
  for (const item of topicsOnLevel(level)) {
    if (!categories.includes(item.category)) categories.push(item.category);
  }
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [notice, setNotice] = useState("");

  function createFromTheme() {
    const query = theme.trim();
    const themed = query ? cardsForTheme(query, tongue).filter((card) => card.level === level) : [];
    const found = themed.length > 0 ? themed : query ? cardsForTheme(query, tongue) : [];
    if (found.length === 0 && hasPhoto) {
      const scene = cardsForPhoto(level);
      setNotice("");
      onGenerate(scene.map((card) => card.id), tongue === "uk" ? "За фото" : "From photo");
      return;
    }
    if (found.length === 0) {
      setNotice(tongue === "uk" ? "У колоді немає слів за цією темою." : "No deck words match this theme.");
      return;
    }
    setNotice("");
    onGenerate(found.map((card) => card.id), query);
  }

  return (
    <div className="flex flex-col gap-2" role="list" aria-label="Topics">
      <button
        type="button"
        onClick={() => {
          setOpen((value) => !value);
          setNotice("");
        }}
        className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-emerald-400 bg-[#111827] text-sm font-medium text-emerald-200 shadow-[0_0_24px_rgba(16,185,129,0.18)]"
      >
        <Sparkles className="h-5 w-5 text-emerald-400" />
        Генерувати Картки (за фото/темою)
      </button>
      {open && (
        <form
          className="flex flex-col gap-3 rounded-2xl border border-emerald-400/40 bg-[#111827] p-4"
          onSubmit={(event) => {
            event.preventDefault();
            createFromTheme();
          }}
        >
          <input
            value={theme}
            onChange={(event) => setTheme(event.target.value)}
            placeholder={tongue === "uk" ? "Тема, наприклад кухня" : "Theme, for example kitchen"}
            className="w-full rounded-xl border border-slate-700 bg-[#0f172a] px-3 py-3 text-base text-white outline-none"
          />
          <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-600 text-sm text-slate-300">
            <Camera className="h-4 w-4" />
            {photoName || (tongue === "uk" ? "Додати фото" : "Add a photo")}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setHasPhoto(Boolean(file));
                setPhotoName(file?.name ?? "");
                setNotice("");
              }}
            />
          </label>
          {notice && <p className="text-sm text-red-300">{notice}</p>}
          <button type="submit" className="min-h-11 rounded-xl bg-emerald-500 text-sm font-medium text-slate-950">
            {tongue === "uk" ? "Зібрати картки" : "Build cards"}
          </button>
        </form>
      )}
      {categories.map((category) => {
        const cards = DECK.filter((card) => card.level === level && card.category === category);
        const done = cards.filter((card) => studiedIds.includes(card.id)).length;
        const again = cards.filter((card) => repeatIds.includes(card.id)).length;
        const percent = cards.length === 0 ? 0 : Math.round((done / cards.length) * 100);
        const Icon = ICONS[category] ?? BookOpen;
        return (
          <button
            key={category}
            type="button"
            role="listitem"
            onClick={() => onSelect(category)}
            className="flex min-h-16 items-center gap-3 rounded-xl border border-slate-800 bg-[#111827] px-3 py-3 text-left text-slate-100 hover:border-emerald-400/50"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0f172a] text-emerald-300">
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-base">{t(tongue, category as UiKey)}</span>
              <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-[#1e293b]">
                <span className="block h-full rounded-full bg-emerald-500" style={{ width: `${percent}%` }} />
              </span>
            </span>
            <span className="shrink-0 text-right text-xs leading-4 text-slate-400">
              <span className="block text-emerald-300">{done}/{cards.length}</span>
              {again > 0 && <span className="block text-red-300">{again} {tongue === "uk" ? "повторити" : "review"}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
