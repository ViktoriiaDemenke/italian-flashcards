import { useEffect } from "react";

export function useSpeech() {
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
    const rate = 0.7;
    console.log("Speaking:", text, rate);
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const phrase = text.trim();
    if (!phrase) return;
    const synthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = "it-IT";
    utterance.rate = rate;
    try {
      const voice = synthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("it"));
      if (voice) utterance.voice = voice;
    } catch {
      utterance.voice = null;
    }
    synthesis.pause();
    synthesis.cancel();
    if (synthesis.paused) synthesis.resume();
    synthesis.speak(utterance);
  }

  return { speak };
}
