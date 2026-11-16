import type { MotherTongue, StudyCard } from "../types";

export function grammarHint(card: StudyCard, tongue: MotherTongue) {
  const present = card.kind === "verb" ? card.tenses?.presente : undefined;
  if (present) {
    return line(
      tongue,
      `Дієслово. Теперішній час: io ${present.io}, tu ${present.tu}, lui/lei ${present.lui}.`,
      `Verb. Present: io ${present.io}, tu ${present.tu}, lui/lei ${present.lui}.`,
    );
  }
  const word = card.italian.trim();
  const article = word.match(/^(il|lo|la|i|gli|le|l')\s+/i)?.[1]?.toLowerCase();
  if (article === "il" || article === "lo") return line(tongue, "Іменник чоловічого роду, однина.", "Masculine singular noun.");
  if (article === "la") return line(tongue, "Іменник жіночого роду, однина.", "Feminine singular noun.");
  if (article === "i" || article === "gli") return line(tongue, "Іменник чоловічого роду, множина.", "Masculine plural noun.");
  if (article === "le") return line(tongue, "Іменник жіночого роду, множина.", "Feminine plural noun.");
  if (article === "l'") {
    const stem = word.slice(2).trim();
    const feminine = /a$/i.test(stem);
    return feminine
      ? line(tongue, "Іменник жіночого роду, однина. Артикль l' перед голосною.", "Feminine singular noun. The article l' comes before a vowel.")
      : line(tongue, "Іменник чоловічого роду, однина. Артикль l' перед голосною.", "Masculine singular noun. The article l' comes before a vowel.");
  }
  return line(tongue, `Вживайте «${word}» так, як у прикладі на картці.`, `Use “${word}” as in the example on the card.`);
}

function line(tongue: MotherTongue, uk: string, en: string) {
  return tongue === "uk" ? uk : en;
}
