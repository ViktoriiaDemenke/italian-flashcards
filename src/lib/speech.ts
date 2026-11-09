export function speakItalian(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const phrase = text.replace(/^l'|il |lo |la |i |gli |le /i, "").trim();
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(phrase || text);
  utterance.lang = "it-IT";
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}
