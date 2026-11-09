export function speakItalian(text: string, rate = 1) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const phrase = text.trim();
  if (!phrase) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(phrase);
  utterance.lang = "it-IT";
  utterance.rate = rate;
  const voice = window.speechSynthesis
    .getVoices()
    .find((item) => item.lang.toLowerCase().startsWith("it"));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}
