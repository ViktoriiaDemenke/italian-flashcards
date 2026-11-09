import { useState } from "react";

export function useSpeech() {
  const [rate, setRate] = useState(1.0);

  function speak(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const phrase = text.trim();
    if (!phrase) return;
    const synthesis = window.speechSynthesis;
    synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = "it-IT";
    utterance.rate = rate;
    const voice = synthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("it"));
    if (voice) utterance.voice = voice;
    synthesis.speak(utterance);
  }

  return { rate, setRate, speak };
}
