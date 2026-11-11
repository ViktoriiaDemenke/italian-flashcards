function rateOf(speed: number) {
  return speed === 0.75 ? 0.75 : 1;
}

function italianVoice(voices: SpeechSynthesisVoice[]) {
  return (
    voices.find((voice) => voice.lang.toLowerCase() === "it-it") ??
    voices.find((voice) => voice.lang.toLowerCase().includes("it"))
  );
}

function whenVoicesReady(synthesis: SpeechSynthesis) {
  synthesis.getVoices();
  if (synthesis.getVoices().length > 0) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const finish = () => {
      synthesis.onvoiceschanged = null;
      resolve();
    };
    synthesis.onvoiceschanged = finish;
    window.setTimeout(finish, 700);
  });
}

export function speakText(text: string, speed: number) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const phrase = text.trim();
  if (!phrase) return;
  const synthesis = window.speechSynthesis;
  void whenVoicesReady(synthesis).then(() => {
    synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    const voice = italianVoice(synthesis.getVoices());
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang.includes("it") ? voice.lang : "it-IT";
    } else {
      utterance.lang = "it-IT";
    }
    utterance.rate = rateOf(speed);
    window.setTimeout(() => {
      synthesis.resume();
      synthesis.speak(utterance);
    }, 40);
  });
}
