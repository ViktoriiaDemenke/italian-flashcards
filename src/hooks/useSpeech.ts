import { useEffect } from "react";

function italianVoice(voices: SpeechSynthesisVoice[]) {
  return voices.find((voice) => voice.lang.toLowerCase().replace("_", "-").startsWith("it"));
}

export function useSpeech() {
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const synthesis = window.speechSynthesis;
    const load = () => synthesis.getVoices();
    load();
    synthesis.addEventListener("voiceschanged", load);
    return () => synthesis.removeEventListener("voiceschanged", load);
  }, []);

  function speak(text: string, rate = 1) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const phrase = text.trim();
    if (!phrase) return;
    const synthesis = window.speechSynthesis;
    const wasBusy = synthesis.speaking || synthesis.pending;
    if (wasBusy) synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = "it-IT";
    utterance.rate = rate;
    const voice = italianVoice(synthesis.getVoices());
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }
    if (wasBusy) window.setTimeout(() => synthesis.speak(utterance), 50);
    else synthesis.speak(utterance);
  }

  return { speak };
}
