import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

export function initStatusBar() {
  if (!Capacitor.isNativePlatform()) return;
  void StatusBar.setStyle({ style: Style.Dark });
  void StatusBar.setBackgroundColor({ color: "#0f172a" });
}
