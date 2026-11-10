import type { MotherTongue } from "../types";

export const TONGUES: {
  id: MotherTongue;
  code: string;
  flag: string;
  name: string;
}[] = [
  { id: "en", code: "EN", flag: "🇬🇧", name: "English" },
  { id: "uk", code: "UK", flag: "🇺🇦", name: "Українська" },
  { id: "ru", code: "RU", flag: "🇷🇺", name: "Русский" },
  { id: "de", code: "DE", flag: "🇩🇪", name: "Deutsch" },
  { id: "pl", code: "PL", flag: "🇵🇱", name: "Polski" },
  { id: "es", code: "ES", flag: "🇪🇸", name: "Español" },
  { id: "fr", code: "FR", flag: "🇫🇷", name: "Français" },
  { id: "ro", code: "RO", flag: "🇷🇴", name: "Română" },
];

export type UiKey =
  | "streak"
  | "cardsToday"
  | "beginner"
  | "elementary"
  | "intermediate"
  | "advanced"
  | "quick"
  | "home"
  | "calendar"
  | "verbs"
  | "nouns"
  | "adjectives"
  | "idioms"
  | "mixed"
  | "living"
  | "bath"
  | "bedroom"
  | "kitchen"
  | "kids"
  | "furniture"
  | "appliances"
  | "weekdays"
  | "months"
  | "seasons"
  | "cardinals"
  | "ordinals"
  | "time"
  | "essere"
  | "avere"
  | "andare"
  | "fare"
  | "potere"
  | "volere"
  | "dovere"
  | "numbers"
  | "tempo_calendario"
  | "tempo"
  | "casa"
  | "numeri"
  | "corpo"
  | "famiglia"
  | "direzione"
  | "cibo"
  | "vestiti"
  | "trasporti"
  | "verbi"
  | "mobili_pulizia"
  | "meteo_stagioni"
  | "numeri_ordinali"
  | "salute_farmacia"
  | "relazioni_carattere"
  | "mobilita_urbana"
  | "ristorante_cucina"
  | "shopping_taglie"
  | "professioni_lavoro"
  | "viaggi_hotel"
  | "sentimenti_emozioni"
  | "lavoro_colloquio"
  | "salute_mentale"
  | "viaggi_imprevisti"
  | "tecnologia_social"
  | "cultura_spettacolo"
  | "banca_servizi"
  | "ambiente_natura"
  | "relazioni_conflitti"
  | "problemi_riparazioni"
  | "city"
  | "transport"
  | "shopping"
  | "clothes"
  | "health"
  | "bureaucracy"
  | "work"
  | "emotions"
  | "environment"
  | "technology"
  | "character"
  | "documents"
  | "repairs"
  | "rent"
  | "slang"
  | "society"
  | "social"
  | "finance"
  | "flashcards"
  | "quiz"
  | "cardOf"
  | "reveal"
  | "hide"
  | "back"
  | "save"
  | "saved"
  | "next"
  | "flip"
  | "again"
  | "hard"
  | "good"
  | "easy"
  | "min"
  | "day"
  | "days3"
  | "days7"
  | "revealToGrade"
  | "session"
  | "complete"
  | "empty"
  | "graded"
  | "keep"
  | "againBtn"
  | "stats"
  | "mastered"
  | "repeat"
  | "accuracy"
  | "mother"
  | "means"
  | "speak";

const UI: Record<UiKey, Record<MotherTongue, string>> = {
  streak: {
    en: "Day Streak",
    uk: "днів поспіль",
    ru: "дней подряд",
    de: "Tage-Serie",
    pl: "dni z rzędu",
    es: "días seguidos",
    fr: "jours d'affilée",
    ro: "zile la rând",
  },
  cardsToday: {
    en: "Cards today",
    uk: "Карток сьогодні",
    ru: "Карточек сегодня",
    de: "Karten heute",
    pl: "Karty dziś",
    es: "Tarjetas hoy",
    fr: "Cartes aujourd'hui",
    ro: "Carduri azi",
  },
  beginner: { en: "Beginner", uk: "Початковий", ru: "Начальный", de: "Anfänger", pl: "Początkujący", es: "Principiante", fr: "Débutant", ro: "Începător" },
  elementary: { en: "Elementary", uk: "Елементарний", ru: "Элементарный", de: "Grundstufe", pl: "Podstawowy", es: "Elemental", fr: "Élémentaire", ro: "Elementar" },
  intermediate: { en: "Intermediate", uk: "Середній", ru: "Средний", de: "Mittelstufe", pl: "Średni", es: "Intermedio", fr: "Intermédiaire", ro: "Intermediar" },
  advanced: { en: "Advanced", uk: "Просунутий", ru: "Продвинутый", de: "Fortgeschritten", pl: "Zaawansowany", es: "Avanzado", fr: "Avancé", ro: "Avansat" },
  quick: { en: "Quick Review", uk: "Швидке повторення", ru: "Быстрое повторение", de: "Schnellwiederholung", pl: "Szybka powtórka", es: "Repaso rápido", fr: "Révision rapide", ro: "Recapitulare rapidă" },
  home: { en: "Home and kitchen", uk: "Дім і кухня", ru: "Дом и кухня", de: "Haus und Küche", pl: "Dom i kuchnia", es: "Casa y cocina", fr: "Maison et cuisine", ro: "Casă și bucătărie" },
  calendar: { en: "Calendar and time", uk: "Календар і час", ru: "Календарь и время", de: "Kalender und Zeit", pl: "Kalendarz i czas", es: "Calendario y tiempo", fr: "Calendrier et temps", ro: "Calendar și timp" },
  verbs: { en: "Basic verbs", uk: "Базові дієслова", ru: "Базовые глаголы", de: "Grundverben", pl: "Podstawowe czasowniki", es: "Verbos básicos", fr: "Verbes de base", ro: "Verbe de bază" },
  nouns: { en: "Nouns", uk: "Іменники", ru: "Существительные", de: "Substantive", pl: "Rzeczowniki", es: "Sustantivos", fr: "Noms", ro: "Substantive" },
  adjectives: { en: "Adjectives", uk: "Прикметники", ru: "Прилагательные", de: "Adjektive", pl: "Przymiotniki", es: "Adjetivos", fr: "Adjectifs", ro: "Adjective" },
  idioms: { en: "Idioms", uk: "Ідіоми", ru: "Идиомы", de: "Redewendungen", pl: "Idiomy", es: "Modismos", fr: "Expressions", ro: "Expresii" },
  mixed: { en: "Mixed mode", uk: "Змішаний режим", ru: "Смешанный режим", de: "Gemischt", pl: "Tryb mieszany", es: "Modo mixto", fr: "Mode mixte", ro: "Mod mixt" },
  living: { en: "Living room", uk: "Вітальня", ru: "Гостиная", de: "Wohnzimmer", pl: "Salon", es: "Salón", fr: "Séjour", ro: "Sufragerie" },
  bath: { en: "Bathroom", uk: "Ванна", ru: "Ванная", de: "Badezimmer", pl: "Łazienka", es: "Baño", fr: "Salle de bain", ro: "Baie" },
  bedroom: { en: "Bedroom", uk: "Спальня", ru: "Спальня", de: "Schlafzimmer", pl: "Sypialnia", es: "Dormitorio", fr: "Chambre", ro: "Dormitor" },
  kitchen: { en: "Kitchen", uk: "Кухня", ru: "Кухня", de: "Küche", pl: "Kuchnia", es: "Cocina", fr: "Cuisine", ro: "Bucătărie" },
  kids: { en: "Child's room", uk: "Дитяча", ru: "Детская", de: "Kinderzimmer", pl: "Pokój dziecka", es: "Cuarto infantil", fr: "Chambre d'enfant", ro: "Camera copilului" },
  furniture: { en: "Furniture", uk: "Меблі", ru: "Мебель", de: "Möbel", pl: "Meble", es: "Muebles", fr: "Meubles", ro: "Mobilă" },
  appliances: { en: "Appliances", uk: "Побутова техніка", ru: "Бытовая техника", de: "Haushaltsgeräte", pl: "Sprzęt AGD", es: "Electrodomésticos", fr: "Électroménager", ro: "Aparate electrocasnice" },
  weekdays: { en: "Weekdays", uk: "Дні тижня", ru: "Дни недели", de: "Wochentage", pl: "Dni tygodnia", es: "Días de la semana", fr: "Jours de la semaine", ro: "Zilele săptămânii" },
  months: { en: "Months", uk: "Місяці", ru: "Месяцы", de: "Monate", pl: "Miesiące", es: "Meses", fr: "Mois", ro: "Luni" },
  seasons: { en: "Seasons", uk: "Пори року", ru: "Времена года", de: "Jahreszeiten", pl: "Pory roku", es: "Estaciones", fr: "Saisons", ro: "Anotimpuri" },
  cardinals: { en: "Cardinal numbers", uk: "Кількісні числівники", ru: "Количественные числительные", de: "Grundzahlen", pl: "Liczebniki główne", es: "Números cardinales", fr: "Nombres cardinaux", ro: "Numerale cardinale" },
  ordinals: { en: "Ordinal numbers", uk: "Порядкові числівники", ru: "Порядковые числительные", de: "Ordnungszahlen", pl: "Liczebniki porządkowe", es: "Números ordinales", fr: "Nombres ordinaux", ro: "Numerale ordinale" },
  time: { en: "Time expressions", uk: "Вирази часу", ru: "Выражения времени", de: "Zeitangaben", pl: "Wyrażenia czasu", es: "Expresiones de tiempo", fr: "Expressions de temps", ro: "Expresii de timp" },
  essere: { en: "To be", uk: "Бути", ru: "Быть", de: "Sein", pl: "Być", es: "Ser", fr: "Être", ro: "A fi" },
  avere: { en: "To have", uk: "Мати", ru: "Иметь", de: "Haben", pl: "Mieć", es: "Tener", fr: "Avoir", ro: "A avea" },
  andare: { en: "To go", uk: "Йти", ru: "Идти", de: "Gehen", pl: "Iść", es: "Ir", fr: "Aller", ro: "A merge" },
  fare: { en: "To do", uk: "Робити", ru: "Делать", de: "Machen", pl: "Robić", es: "Hacer", fr: "Faire", ro: "A face" },
  potere: { en: "Can", uk: "Могти", ru: "Мочь", de: "Können", pl: "Móc", es: "Poder", fr: "Pouvoir", ro: "A putea" },
  volere: { en: "To want", uk: "Хотіти", ru: "Хотеть", de: "Wollen", pl: "Chcieć", es: "Querer", fr: "Vouloir", ro: "A vrea" },
  dovere: { en: "Must", uk: "Мусити", ru: "Должен", de: "Müssen", pl: "Musieć", es: "Deber", fr: "Devoir", ro: "A trebui" },
  numbers: { en: "Numbers", uk: "Числівники", ru: "Числительные", de: "Zahlen", pl: "Liczebniki", es: "Números", fr: "Nombres", ro: "Numerale" },
  tempo_calendario: { en: "Calendar and time", uk: "Календар і час", ru: "Календарь и время", de: "Kalender und Zeit", pl: "Kalendarz i czas", es: "Calendario y tiempo", fr: "Calendrier et temps", ro: "Calendar și timp" },
  tempo: { en: "Time and calendar", uk: "Час і календар", ru: "Время и календарь", de: "Zeit und Kalender", pl: "Czas i kalendarz", es: "Tiempo y calendario", fr: "Temps et calendrier", ro: "Timp și calendar" },
  casa: { en: "Home and kitchen", uk: "Дім і кухня", ru: "Дом и кухня", de: "Haus und Küche", pl: "Dom i kuchnia", es: "Casa y cocina", fr: "Maison et cuisine", ro: "Casă și bucătărie" },
  numeri: { en: "Numbers and prices", uk: "Числівники та ціни", ru: "Числительные и цены", de: "Zahlen und Preise", pl: "Liczebniki i ceny", es: "Números y precios", fr: "Nombres et prix", ro: "Numerale și prețuri" },
  corpo: { en: "The human body", uk: "Тіло людини", ru: "Тело человека", de: "Der menschliche Körper", pl: "Ciało człowieka", es: "El cuerpo humano", fr: "Le corps humain", ro: "Corpul omenesc" },
  famiglia: { en: "Family and people", uk: "Сім'я та люди", ru: "Семья и люди", de: "Familie und Menschen", pl: "Rodzina i ludzie", es: "Familia y personas", fr: "Famille et personnes", ro: "Familie și oameni" },
  direzione: { en: "Direction and movement", uk: "Напрямок і рух", ru: "Направление и движение", de: "Richtung und Bewegung", pl: "Kierunek i ruch", es: "Dirección y movimiento", fr: "Direction et mouvement", ro: "Direcție și mișcare" },
  cibo: { en: "Food and the restaurant", uk: "Їжа та ресторан", ru: "Еда и ресторан", de: "Essen und Restaurant", pl: "Jedzenie i restauracja", es: "Comida y restaurante", fr: "Nourriture et restaurant", ro: "Mâncare și restaurant" },
  vestiti: { en: "Clothes and shopping", uk: "Одяг та покупки", ru: "Одежда и покупки", de: "Kleidung und Einkaufen", pl: "Ubrania i zakupy", es: "Ropa y compras", fr: "Vêtements et courses", ro: "Haine și cumpărături" },
  trasporti: { en: "Transport and the city", uk: "Транспорт і місто", ru: "Транспорт и город", de: "Verkehr und Stadt", pl: "Transport i miasto", es: "Transporte y ciudad", fr: "Transports et ville", ro: "Transport și oraș" },
  verbi: { en: "Basic verbs", uk: "Базові дієслова", ru: "Базовые глаголы", de: "Grundverben", pl: "Podstawowe czasowniki", es: "Verbos básicos", fr: "Verbes de base", ro: "Verbe de bază" },
  mobili_pulizia: { en: "Furniture and cleaning", uk: "Меблі та прибирання", ru: "Мебель и уборка", de: "Möbel und Putzen", pl: "Meble i sprzątanie", es: "Muebles y limpieza", fr: "Meubles et ménage", ro: "Mobilă și curățenie" },
  meteo_stagioni: { en: "Weather and seasons", uk: "Погода та пори року", ru: "Погода и времена года", de: "Wetter und Jahreszeiten", pl: "Pogoda i pory roku", es: "Tiempo y estaciones", fr: "Météo et saisons", ro: "Vreme și anotimpuri" },
  numeri_ordinali: { en: "Ordinals and calculations", uk: "Порядкові числівники та розрахунки", ru: "Порядковые числительные и расчёты", de: "Ordnungszahlen und Rechnen", pl: "Liczebniki porządkowe i obliczenia", es: "Ordinales y cálculos", fr: "Ordinaux et calculs", ro: "Ordinale și calcule" },
  salute_farmacia: { en: "Health, symptoms, and the pharmacy", uk: "Здоров'я, симптоми та аптека", ru: "Здоровье, симптомы и аптека", de: "Gesundheit, Symptome und Apotheke", pl: "Zdrowie, objawy i apteka", es: "Salud, síntomas y farmacia", fr: "Santé, symptômes et pharmacie", ro: "Sănătate, simptome și farmacie" },
  relazioni_carattere: { en: "Relationships, character, and people", uk: "Стосунки, характер та опис людей", ru: "Отношения, характер и описание людей", de: "Beziehungen, Charakter und Menschen", pl: "Relacje, charakter i opis ludzi", es: "Relaciones, carácter y personas", fr: "Relations, caractère et personnes", ro: "Relații, caracter și oameni" },
  mobilita_urbana: { en: "City navigation and routes", uk: "Міська навігація та маршрути", ru: "Городская навигация и маршруты", de: "Stadtnavigation und Routen", pl: "Nawigacja miejska i trasy", es: "Navegación urbana y rutas", fr: "Navigation urbaine et itinéraires", ro: "Navigație urbană și rute" },
  ristorante_cucina: { en: "At the restaurant and cooking", uk: "У ресторані та кулінарія", ru: "В ресторане и кулинария", de: "Im Restaurant und Kochen", pl: "W restauracji i kuchnia", es: "En el restaurante y cocina", fr: "Au restaurant et cuisine", ro: "La restaurant și bucătărie" },
  shopping_taglie: { en: "Shopping, sizes, and fitting", uk: "Покупки, розміри та примірка", ru: "Покупки, размеры и примерка", de: "Einkaufen, Größen und Anprobe", pl: "Zakupy, rozmiary i przymiarka", es: "Compras, tallas y prueba", fr: "Courses, tailles et essayage", ro: "Cumpărături, mărimi și probă" },
  professioni_lavoro: { en: "Jobs and the work schedule", uk: "Професії та робочий розклад", ru: "Профессии и рабочий график", de: "Berufe und Arbeitsplan", pl: "Zawody i grafik pracy", es: "Profesiones y horario", fr: "Métiers et horaires", ro: "Meserii și program de lucru" },
  viaggi_hotel: { en: "Travel, hotel, and airport", uk: "Подорожі, готель та аеропорт", ru: "Путешествия, отель и аэропорт", de: "Reisen, Hotel und Flughafen", pl: "Podróże, hotel i lotnisko", es: "Viajes, hotel y aeropuerto", fr: "Voyages, hôtel et aéroport", ro: "Călătorii, hotel și aeroport" },
  sentimenti_emozioni: { en: "Feelings and emotions", uk: "Почуття та емоції", ru: "Чувства и эмоции", de: "Gefühle und Emotionen", pl: "Uczucia i emocje", es: "Sentimientos y emociones", fr: "Sentiments et émotions", ro: "Sentimente și emoții" },
  lavoro_colloquio: { en: "Work and the interview", uk: "Робота та співбесіда", ru: "Работа и собеседование", de: "Arbeit und Vorstellungsgespräch", pl: "Praca i rozmowa", es: "Trabajo y entrevista", fr: "Travail et entretien", ro: "Muncă și interviu" },
  salute_mentale: { en: "Mental health and wellbeing", uk: "Психічне здоров'я та самопочуття", ru: "Психическое здоровье и самочувствие", de: "Psychische Gesundheit und Wohlbefinden", pl: "Zdrowie psychiczne i samopoczucie", es: "Salud mental y bienestar", fr: "Santé mentale et bien-être", ro: "Sănătate mintală și stare de bine" },
  viaggi_imprevisti: { en: "Travel and unexpected situations", uk: "Подорожі та непередбачувані ситуації", ru: "Путешествия и непредвиденные ситуации", de: "Reisen und unvorhergesehene Situationen", pl: "Podróże i nieprzewidziane sytuacje", es: "Viajes y imprevistos", fr: "Voyages et imprévus", ro: "Călătorii și situații neprevăzute" },
  tecnologia_social: { en: "Technology and social media", uk: "Технології та соцмережі", ru: "Технологии и соцсети", de: "Technik und soziale Medien", pl: "Technologia i media społecznościowe", es: "Tecnología y redes", fr: "Technologie et réseaux", ro: "Tehnologie și rețele sociale" },
  cultura_spettacolo: { en: "Culture and entertainment", uk: "Культура та розваги", ru: "Культура и развлечения", de: "Kultur und Unterhaltung", pl: "Kultura i rozrywka", es: "Cultura y ocio", fr: "Culture et loisirs", ro: "Cultură și distracție" },
  banca_servizi: { en: "Bank and services", uk: "Банк та послуги", ru: "Банк и услуги", de: "Bank und Dienste", pl: "Bank i usługi", es: "Banco y servicios", fr: "Banque et services", ro: "Bancă și servicii" },
  ambiente_natura: { en: "Environment and nature", uk: "Довкілля та природа", ru: "Окружающая среда и природа", de: "Umwelt und Natur", pl: "Środowisko i natura", es: "Medio ambiente y naturaleza", fr: "Environnement et nature", ro: "Mediu și natură" },
  relazioni_conflitti: { en: "Relationships and conflicts", uk: "Стосунки та конфлікти", ru: "Отношения и конфликты", de: "Beziehungen und Konflikte", pl: "Relacje i konflikty", es: "Relaciones y conflictos", fr: "Relations et conflits", ro: "Relații și conflicte" },
  problemi_riparazioni: { en: "Household problems and repairs", uk: "Побутові проблеми та ремонт", ru: "Бытовые проблемы и ремонт", de: "Alltagsprobleme und Reparaturen", pl: "Problemy domowe i naprawy", es: "Problemas del hogar y reparaciones", fr: "Problèmes du quotidien et réparations", ro: "Probleme casnice și reparații" },
  city: { en: "City", uk: "Місто", ru: "Город", de: "Stadt", pl: "Miasto", es: "Ciudad", fr: "Ville", ro: "Oraș" },
  transport: { en: "Transport", uk: "Транспорт", ru: "Транспорт", de: "Verkehr", pl: "Transport", es: "Transporte", fr: "Transports", ro: "Transport" },
  shopping: { en: "Shopping", uk: "Покупки", ru: "Покупки", de: "Einkaufen", pl: "Zakupy", es: "Compras", fr: "Courses", ro: "Cumpărături" },
  clothes: { en: "Clothes", uk: "Одяг", ru: "Одежда", de: "Kleidung", pl: "Ubrania", es: "Ropa", fr: "Vêtements", ro: "Haine" },
  health: { en: "Health", uk: "Здоров'я", ru: "Здоровье", de: "Gesundheit", pl: "Zdrowie", es: "Salud", fr: "Santé", ro: "Sănătate" },
  bureaucracy: { en: "Bureaucracy", uk: "Бюрократія", ru: "Бюрократия", de: "Bürokratie", pl: "Biurokracja", es: "Burocracia", fr: "Bureaucratie", ro: "Birocrație" },
  work: { en: "Work", uk: "Робота", ru: "Работа", de: "Arbeit", pl: "Praca", es: "Trabajo", fr: "Travail", ro: "Muncă" },
  emotions: { en: "Emotions", uk: "Емоції", ru: "Эмоции", de: "Gefühle", pl: "Emocje", es: "Emociones", fr: "Émotions", ro: "Emoții" },
  environment: { en: "Environment", uk: "Довкілля", ru: "Окружающая среда", de: "Umwelt", pl: "Środowisko", es: "Medio ambiente", fr: "Environnement", ro: "Mediu" },
  technology: { en: "Technology", uk: "Технології", ru: "Технологии", de: "Technik", pl: "Technologia", es: "Tecnología", fr: "Technologie", ro: "Tehnologie" },
  character: { en: "Emotions and character", uk: "Емоції та характер", ru: "Эмоции и характер", de: "Gefühle und Charakter", pl: "Emocje i charakter", es: "Emociones y carácter", fr: "Émotions et caractère", ro: "Emoții și caracter" },
  documents: { en: "Documents and bureaucracy", uk: "Документи і бюрократія", ru: "Документы и бюрократия", de: "Dokumente und Bürokratie", pl: "Dokumenty i biurokracja", es: "Documentos y burocracia", fr: "Documents et bureaucratie", ro: "Documente și birocrație" },
  repairs: { en: "Rent and repairs", uk: "Оренда та несправності", ru: "Аренда и поломки", de: "Miete und Schäden", pl: "Czynsz i usterki", es: "Alquiler y averías", fr: "Loyer et pannes", ro: "Chirie și defecțiuni" },
  rent: { en: "Rent and repairs", uk: "Оренда та несправності", ru: "Аренда и поломки", de: "Miete und Schäden", pl: "Czynsz i usterki", es: "Alquiler y averías", fr: "Loyer et pannes", ro: "Chirie și defecțiuni" },
  slang: { en: "Italian slang and sayings", uk: "Сленг і вирази", ru: "Сленг и выражения", de: "Umgangssprache und Redensarten", pl: "Slang i powiedzenia", es: "Jerga y expresiones", fr: "Argot et expressions", ro: "Argou și expresii" },
  society: { en: "Society and news", uk: "Суспільство та новини", ru: "Общество и новости", de: "Gesellschaft und Aktuelles", pl: "Społeczeństwo i aktualności", es: "Sociedad y actualidad", fr: "Société et actualité", ro: "Societate și actualitate" },
  social: { en: "Technology and social media", uk: "Технології та соцмережі", ru: "Технологии и соцсети", de: "Technik und soziale Medien", pl: "Technologia i media", es: "Tecnología y redes", fr: "Technologie et réseaux", ro: "Tehnologie și rețele" },
  finance: { en: "Finance and banking", uk: "Фінанси та банк", ru: "Финансы и банк", de: "Finanzen und Bank", pl: "Finanse i bank", es: "Finanzas y banco", fr: "Finances et banque", ro: "Finanțe și bancă" },
  flashcards: { en: "Flashcards", uk: "Картки", ru: "Карточки", de: "Karteikarten", pl: "Fiszki", es: "Tarjetas", fr: "Cartes", ro: "Carduri" },
  quiz: { en: "Quiz Mode", uk: "Режим тесту", ru: "Режим теста", de: "Quizmodus", pl: "Tryb quizu", es: "Modo quiz", fr: "Mode quiz", ro: "Mod quiz" },
  cardOf: { en: "CARD {n} OF {total}", uk: "КАРТКА {n} З {total}", ru: "КАРТОЧКА {n} ИЗ {total}", de: "KARTE {n} VON {total}", pl: "KARTA {n} Z {total}", es: "TARJETA {n} DE {total}", fr: "CARTE {n} SUR {total}", ro: "CARDUL {n} DIN {total}" },
  reveal: { en: "Click to reveal the translation", uk: "Натисніть, щоб побачити переклад", ru: "Нажмите, чтобы увидеть перевод", de: "Klicken, um die Übersetzung zu sehen", pl: "Kliknij, aby zobaczyć tłumaczenie", es: "Clic para ver la traducción", fr: "Cliquez pour voir la traduction", ro: "Clic pentru traducere" },
  hide: { en: "Click to return to Italian", uk: "Натисніть, щоб повернутись до італійської", ru: "Нажмите, чтобы вернуться к итальянскому", de: "Klicken, um zum Italienischen zurückzukehren", pl: "Kliknij, aby wrócić do włoskiego", es: "Clic para volver al italiano", fr: "Cliquez pour revenir à l'italien", ro: "Clic pentru a reveni la italiană" },
  back: { en: "← Back", uk: "← Назад", ru: "← Назад", de: "← Zurück", pl: "← Wstecz", es: "← Atrás", fr: "← Retour", ro: "← Înapoi" },
  save: { en: "Save / Review later", uk: "Зберегти / Повторити пізніше", ru: "Сохранить / Повторить позже", de: "Speichern / Später wiederholen", pl: "Zapisz / Powtórz później", es: "Guardar / Repetir luego", fr: "Enregistrer / Revoir plus tard", ro: "Salvează / Repetă mai târziu" },
  saved: { en: "Saved / To repeat", uk: "Збережено / Повторити", ru: "Сохранено / Повторить", de: "Gespeichert / Wiederholen", pl: "Zapisane / Do powtórki", es: "Guardada / A repetir", fr: "Enregistrée / À revoir", ro: "Salvată / De repetat" },
  next: { en: "Next →", uk: "Далі →", ru: "Дальше →", de: "Weiter →", pl: "Dalej →", es: "Siguiente →", fr: "Suivant →", ro: "Înainte →" },
  flip: { en: "Flip card", uk: "Перевернути картку", ru: "Перевернуть карточку", de: "Karte drehen", pl: "Obróć kartę", es: "Voltear tarjeta", fr: "Retourner la carte", ro: "Întoarce cardul" },
  again: { en: "Again", uk: "Знову", ru: "Снова", de: "Nochmal", pl: "Znów", es: "Otra vez", fr: "Encore", ro: "Din nou" },
  hard: { en: "Hard", uk: "Важко", ru: "Трудно", de: "Schwer", pl: "Trudne", es: "Difícil", fr: "Difficile", ro: "Greu" },
  good: { en: "Good", uk: "Добре", ru: "Хорошо", de: "Gut", pl: "Dobrze", es: "Bien", fr: "Bien", ro: "Bine" },
  easy: { en: "Easy", uk: "Легко", ru: "Легко", de: "Leicht", pl: "Łatwo", es: "Fácil", fr: "Facile", ro: "Ușor" },
  min: { en: "< 1 MIN", uk: "< 1 ХВ", ru: "< 1 МИН", de: "< 1 MIN", pl: "< 1 MIN", es: "< 1 MIN", fr: "< 1 MIN", ro: "< 1 MIN" },
  day: { en: "1 DAY", uk: "1 ДЕНЬ", ru: "1 ДЕНЬ", de: "1 TAG", pl: "1 DZIEŃ", es: "1 DÍA", fr: "1 JOUR", ro: "1 ZI" },
  days3: { en: "3 DAYS", uk: "3 ДНІ", ru: "3 ДНЯ", de: "3 TAGE", pl: "3 DNI", es: "3 DÍAS", fr: "3 JOURS", ro: "3 ZILE" },
  days7: { en: "7 DAYS", uk: "7 ДНІВ", ru: "7 ДНЕЙ", de: "7 TAGE", pl: "7 DNI", es: "7 DÍAS", fr: "7 JOURS", ro: "7 ZILE" },
  revealToGrade: { en: "Reveal the card to grade your recall", uk: "Відкрийте картку, щоб оцінити пам'ять", ru: "Откройте карточку, чтобы оценить ответ", de: "Karte aufdecken, um die Antwort zu bewerten", pl: "Odkryj kartę, aby ocenić odpowiedź", es: "Revela la tarjeta para evaluar", fr: "Retournez la carte pour noter", ro: "Descoperă cardul ca să evaluezi" },
  session: { en: "SESSION", uk: "СЕСІЯ", ru: "СЕССИЯ", de: "SITZUNG", pl: "SESJA", es: "SESIÓN", fr: "SESSION", ro: "SESIUNE" },
  complete: { en: "Session complete", uk: "Сесію завершено", ru: "Сессия завершена", de: "Sitzung beendet", pl: "Sesja ukończona", es: "Sesión completa", fr: "Session terminée", ro: "Sesiune completă" },
  empty: { en: "No cards at this level", uk: "Немає карток на цьому рівні", ru: "Нет карточек на этом уровне", de: "Keine Karten auf dieser Stufe", pl: "Brak kart na tym poziomie", es: "No hay tarjetas en este nivel", fr: "Aucune carte à ce niveau", ro: "Nu sunt carduri la acest nivel" },
  graded: { en: "You graded {n} cards in this pass. Accuracy is {p}%.", uk: "Ви оцінили {n} карток. Точність {p}%.", ru: "Вы оценили {n} карточек. Точность {p}%.", de: "Du hast {n} Karten bewertet. Genauigkeit {p}%.", pl: "Oceniono {n} kart. Trafność {p}%.", es: "Evaluaste {n} tarjetas. Precisión {p}%.", fr: "Vous avez noté {n} cartes. Précision {p} %.", ro: "Ai evaluat {n} carduri. Acuratețe {p}%." },
  keep: { en: "Choose another level or category to keep studying.", uk: "Оберіть інший рівень або категорію.", ru: "Выберите другой уровень или категорию.", de: "Wähle eine andere Stufe oder Kategorie.", pl: "Wybierz inny poziom albo kategorię.", es: "Elige otro nivel o categoría.", fr: "Choisissez un autre niveau ou une autre catégorie.", ro: "Alege alt nivel sau altă categorie." },
  againBtn: { en: "Study again", uk: "Вчити знову", ru: "Учить снова", de: "Nochmal lernen", pl: "Ucz się znów", es: "Estudiar de nuevo", fr: "Étudier encore", ro: "Studiază din nou" },
  stats: { en: "SESSION STATS", uk: "СТАТИСТИКА СЕСІЇ", ru: "СТАТИСТИКА СЕССИИ", de: "SITZUNGSSTATISTIK", pl: "STATYSTYKI SESJI", es: "ESTADÍSTICAS", fr: "STATS DE SESSION", ro: "STATISTICI" },
  mastered: { en: "Saved", uk: "Збережено", ru: "Сохранено", de: "Gespeichert", pl: "Zapisane", es: "Guardadas", fr: "Enregistrées", ro: "Salvate" },
  repeat: { en: "To repeat", uk: "Повторити", ru: "Повторить", de: "Wiederholen", pl: "Do powtórki", es: "A repetir", fr: "À revoir", ro: "De repetat" },
  accuracy: { en: "Accuracy", uk: "Точність", ru: "Точность", de: "Genauigkeit", pl: "Trafność", es: "Precisión", fr: "Précision", ro: "Acuratețe" },
  mother: { en: "Mother tongue", uk: "Рідна мова", ru: "Родной язык", de: "Muttersprache", pl: "Język ojczysty", es: "Lengua materna", fr: "Langue maternelle", ro: "Limbă maternă" },
  means: { en: "What does this mean?", uk: "Що це означає?", ru: "Что это значит?", de: "Was bedeutet das?", pl: "Co to znaczy?", es: "¿Qué significa?", fr: "Qu'est-ce que cela veut dire ?", ro: "Ce înseamnă?" },
  speak: { en: "Speak Italian", uk: "Вимовити італійською", ru: "Произнести по-итальянски", de: "Italienisch sprechen", pl: "Wymów po włosku", es: "Pronunciar en italiano", fr: "Prononcer en italien", ro: "Pronunță în italiană" },
};

export function t(lang: MotherTongue, key: UiKey) {
  return UI[key][lang];
}

export function cardCount(lang: MotherTongue, n: number, total: number) {
  return t(lang, "cardOf").replace("{n}", String(n)).replace("{total}", String(total));
}

export function gradedLine(lang: MotherTongue, n: number, p: number) {
  return t(lang, "graded").replace("{n}", String(n)).replace("{p}", String(p));
}
