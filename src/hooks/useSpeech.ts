import { useEffect, useState } from "react";

export function useSpeech() {
  const [rate, setRate] = useState(1.0);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.getVoices();
    const prime = () => {
      window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.addEventListener("voiceschanged", prime);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", prime);
  }, []);

  function speak(text: string) {
    console.log("Speaking:", text, rate);
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const phrase = text.trim();
    if (!phrase) return;
    const synthesis = window.speechSynthesis;
    const activeRate = rate === 0.75 ? 0.75 : 1.0;
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = "it-IT";
    utterance.rate = activeRate;
    const voice = synthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("it"));
    if (voice) utterance.voice = voice;
    synthesis.cancel();
    synthesis.speak(utterance);
  }

  return { rate, setRate, speak };
}
