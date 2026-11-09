import type { LangText } from "../types";

type Quad = { en: string; es: string; fr: string; ro: string };
type Extra = { uk: string; ru: string; de: string; pl: string };

const row = (uk: string, ru: string, de: string, pl: string): Extra => ({ uk, ru, de, pl });

const WORDS: Record<string, Extra> = {
  casa: row("дім", "дом", "das Haus", "dom"),
  tavolo: row("стіл", "стол", "der Tisch", "stół"),
  sedia: row("стілець", "стул", "der Stuhl", "krzesło"),
  libro: row("книга", "книга", "das Buch", "książka"),
  porta: row("двері", "дверь", "die Tür", "drzwi"),
  finestra: row("вікно", "окно", "das Fenster", "okno"),
  cucina: row("кухня", "кухня", "die Küche", "kuchnia"),
  letto: row("ліжко", "кровать", "das Bett", "łóżko"),
  specchio: row("дзеркало", "зеркало", "der Spiegel", "lustro"),
  lampada: row("лампа", "лампа", "die Lampe", "lampa"),
  frigorifero: row("холодильник", "холодильник", "der Kühlschrank", "lodówka"),
  asciugamano: row("рушник", "полотенце", "das Handtuch", "ręcznik"),
  divano: row("диван", "диван", "das Sofa", "sofa"),
  sapone: row("мило", "мыло", "die Seife", "mydło"),
  cuscino: row("подушка", "подушка", "das Kissen", "poduszka"),
  piatto: row("тарілка", "тарелка", "der Teller", "talerz"),
  oggi: row("сьогодні", "сегодня", "heute", "dziś"),
  domani: row("завтра", "завтра", "morgen", "jutro"),
  lunedi: row("понеділок", "понедельник", "Montag", "poniedziałek"),
  gennaio: row("січень", "январь", "Januar", "styczeń"),
  ieri: row("вчора", "вчера", "gestern", "wczoraj"),
  settimana: row("тиждень", "неделя", "die Woche", "tydzień"),
  ora: row("година", "час", "die Stunde", "godzina"),
  mese: row("місяць", "месяц", "der Monat", "miesiąc"),
  sabato: row("субота", "суббота", "Samstag", "sobota"),
  domenica: row("неділя", "воскресенье", "Sonntag", "niedziela"),
  mezzogiorno: row("полудень", "полдень", "Mittag", "południe"),
  anno: row("рік", "год", "das Jahr", "rok"),
  primo: row("перший", "первый", "erste", "pierwszy"),
  secondo: row("другий", "второй", "zweite", "drugi"),
  terzo: row("третій", "третий", "dritte", "trzeci"),
  quarto: row("четвертий", "четвёртый", "vierte", "czwarty"),
  quinto: row("п'ятий", "пятый", "fünfte", "piąty"),
  sesto: row("шостий", "шестой", "sechste", "szósty"),
  settimo: row("сьомий", "седьмой", "siebte", "siódmy"),
  ottavo: row("восьмий", "восьмой", "achte", "ósmy"),
  nono: row("дев'ятий", "девятый", "neunte", "dziewiąty"),
  decimo: row("десятий", "десятый", "zehnte", "dziesiąty"),
  essere: row("бути", "быть", "sein", "być"),
  avere: row("мати", "иметь", "haben", "mieć"),
  andare: row("йти", "идти", "gehen", "iść"),
  fare: row("робити", "делать", "machen", "robić"),
  vedere: row("бачити", "видеть", "sehen", "widzieć"),
  parlare: row("говорити", "говорить", "sprechen", "mówić"),
  dovere: row("мусити", "должен", "müssen", "musieć"),
  dire: row("казати", "сказать", "sagen", "powiedzieć"),
  venire: row("приходити", "приходить", "kommen", "przychodzić"),
  prendere: row("брати", "брать", "nehmen", "brać"),
};

WORDS.settimo = WORDS["settimo"] ?? row("сьомий", "седьмой", "siebte", "siódmy");

const EXAMPLES: Record<string, Extra> = {
  casa: row("Дім біля моря.", "Дом у моря.", "Das Haus liegt am Meer.", "Dom jest blisko morza."),
  tavolo: row("Стіл на кухні.", "Стол на кухне.", "Der Tisch ist in der Küche.", "Stół jest w kuchni."),
  sedia: row("Стілець зручний.", "Стул удобный.", "Der Stuhl ist bequem.", "Krzesło jest wygodne."),
  libro: row("Книга на столі.", "Книга на столе.", "Das Buch liegt auf dem Tisch.", "Książka jest na stole."),
  porta: row("Зачини двері, будь ласка.", "Закрой дверь, пожалуйста.", "Schließ die Tür, bitte.", "Zamknij drzwi, proszę."),
  finestra: row("Я відчиняю вікно вранці.", "Я открываю окно утром.", "Ich öffne morgens das Fenster.", "Rano otwieram okno."),
  cucina: row("Кухня світла.", "Кухня светлая.", "Die Küche ist hell.", "Kuchnia jest jasna."),
  letto: row("Ліжко — моє улюблене місце.", "Кровать — моё любимое место.", "Das Bett ist mein Lieblingsplatz.", "Łóżko to moje ulubione miejsce."),
  specchio: row("Дзеркало при вході.", "Зеркало в прихожей.", "Der Spiegel ist im Eingang.", "Lustro jest przy wejściu."),
  lampada: row("Лампа світить тепло.", "У лампы тёплый свет.", "Die Lampe hat warmes Licht.", "Lampa ma ciepłe światło."),
  frigorifero: row("Молоко в холодильнику.", "Молоко в холодильнике.", "Die Milch ist im Kühlschrank.", "Mleko jest w lodówce."),
  asciugamano: row("Я беру чистий рушник.", "Я беру чистое полотенце.", "Ich nehme ein sauberes Handtuch.", "Biorę czysty ręcznik."),
  divano: row("Диван у вітальні.", "Диван в гостиной.", "Das Sofa ist im Wohnzimmer.", "Sofa jest w salonie."),
  sapone: row("Мило у ванній.", "Мыло в ванной.", "Die Seife ist im Bad.", "Mydło jest w łazience."),
  cuscino: row("Подушка на ліжку.", "Подушка на кровати.", "Das Kissen liegt auf dem Bett.", "Poduszka jest na łóżku."),
  piatto: row("Я ставлю тарілку на кухні.", "Я ставлю тарелку на кухне.", "Ich stelle den Teller in die Küche.", "Kładę talerz w kuchni."),
  oggi: row("Сьогодні понеділок.", "Сегодня понедельник.", "Heute ist Montag.", "Dziś jest poniedziałek."),
  domani: row("Завтра я працюю з дому.", "Завтра я работаю из дома.", "Morgen arbeite ich von zu Hause.", "Jutro pracuję z domu."),
  lunedi: row("У понеділок я починаю рано.", "В понедельник я начинаю рано.", "Am Montag fange ich früh an.", "W poniedziałek zaczynam wcześnie."),
  gennaio: row("Січень — перший місяць.", "Январь — первый месяц.", "Januar ist der erste Monat.", "Styczeń to pierwszy miesiąc."),
  ieri: row("Учора я вчив дієслова.", "Вчера я учил глаголы.", "Gestern habe ich die Verben gelernt.", "Wczoraj uczyłem się czasowników."),
  settimana: row("Цього тижня я вчуся щодня.", "На этой неделе я учусь каждый день.", "Diese Woche lerne ich jeden Tag.", "W tym tygodniu uczę się codziennie."),
  ora: row("Котра година?", "Который час?", "Wie spät ist es?", "Która godzina?"),
  mese: row("Наступного місяця я їду.", "В следующем месяце я уезжаю.", "Nächsten Monat fahre ich weg.", "W przyszłym miesiącu wyjeżdżam."),
  sabato: row("У суботу я сплю допізна.", "В субботу я сплю допоздна.", "Am Samstag schlafe ich lange.", "W sobotę śpię do późna."),
  domenica: row("У неділю ми обідаємо разом.", "В воскресенье мы обедаем вместе.", "Am Sonntag essen wir zusammen zu Mittag.", "W niedzielę jemy razem obiad."),
  mezzogiorno: row("Побачимось опівдні.", "Увидимся в полдень.", "Wir sehen uns am Mittag.", "Widzimy się w południe."),
  anno: row("Торік я був у Римі.", "В прошлом году я был в Риме.", "Letztes Jahr habe ich Rom besucht.", "W zeszłym roku odwiedziłem Rzym."),
  primo: row("Це перший день школи.", "Это первый день школы.", "Es ist der erste Schultag.", "To pierwszy dzień szkoły."),
  secondo: row("Я живу на другому поверсі.", "Я живу на втором этаже.", "Ich wohne im zweiten Stock.", "Mieszkam na drugim piętrze."),
  terzo: row("Це третій раз.", "Это третий раз.", "Es ist das dritte Mal.", "To trzeci raz."),
  quarto: row("Лишилося чверть години.", "Осталось четверть часа.", "Es fehlt eine Viertelstunde.", "Został kwadrans."),
  quinto: row("Це п'ятий у списку.", "Это пятый в списке.", "Er ist der fünfte auf der Liste.", "To piąty na liście."),
  sesto: row("Ми на шостому розділі.", "Мы на шестой главе.", "Wir sind beim sechsten Kapitel.", "Jesteśmy przy szóstym rozdziale."),
  settimo: row("Сьомого дня ми відпочиваємо.", "В седьмой день мы отдыхаем.", "Am siebten Tag ruhen wir.", "Siódmego dnia odpoczywamy."),
  ottavo: row("Це восьма спроба.", "Это восьмая попытка.", "Es ist der achte Versuch.", "To ósma próba."),
  nono: row("Дев'ятий місяць — вересень.", "Девятый месяц — сентябрь.", "Der neunte Monat ist September.", "Dziewiąty miesiąc to wrzesień."),
  decimo: row("Це десята річниця.", "Это десятая годовщина.", "Es ist der zehnte Jahrestag.", "To dziesiąta rocznica."),
  essere: row("Я з Рима.", "Я из Рима.", "Ich bin aus Rom.", "Jestem z Rzymu."),
  avere: row("У мене нова книга.", "У меня новая книга.", "Ich habe ein neues Buch.", "Mam nową książkę."),
  andare: row("Я йду на ринок.", "Я иду на рынок.", "Ich gehe zum Markt.", "Idę na targ."),
  fare: row("Я снідаю о восьмій.", "Я завтракаю в восемь.", "Ich frühstücke um acht.", "Śniadanie jem o ósmej."),
  vedere: row("Я бачу море з вікна.", "Я вижу море из окна.", "Ich sehe das Meer vom Fenster.", "Widzę morze z okna."),
  parlare: row("Ми говоримо італійською щодня.", "Мы говорим по-итальянски каждый день.", "Wir sprechen jeden Tag Italienisch.", "Codziennie mówimy po włosku."),
  dovere: row("Мені треба вчити дієслова.", "Мне нужно учить глаголы.", "Ich muss die Verben lernen.", "Muszę uczyć się czasowników."),
  dire: row("Я кажу правду.", "Я говорю правду.", "Ich sage die Wahrheit.", "Mówię prawdę."),
  venire: row("Я з Мілана.", "Я из Милана.", "Ich komme aus Mailand.", "Przyjeżdżam z Mediolanu."),
  prendere: row("Я візьму каву.", "Я возьму кофе.", "Ich nehme einen Kaffee.", "Wezmę kawę."),
};

EXAMPLES.settimo = EXAMPLES["settimo"] ?? row("Сьомого дня ми відпочиваємо.", "В седьмой день мы отдыхаем.", "Am siebten Tag ruhen wir.", "Siódmego dnia odpoczywamy.");

export function widenCard(id: string, quad: Quad, kind: "word" | "example" | "gloss"): LangText {
  const table = kind === "example" ? EXAMPLES : WORDS;
  const extra = table[id];
  if (!extra) throw new Error(`Missing ${kind} translation for ${id}`);
  if (kind === "gloss") {
    return {
      en: quad.en,
      es: quad.es,
      fr: quad.fr,
      ro: quad.ro,
      uk: extra.uk,
      ru: extra.ru,
      de: extra.de,
      pl: extra.pl,
    };
  }
  return { ...quad, ...extra };
}
