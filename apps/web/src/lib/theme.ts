import { useSyncExternalStore } from "react";
import { track } from "./firebase.ts";

export type Theme = "light" | "dark";

const listeners = new Set<() => void>();

function read(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

export function setTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* storage may be unavailable (private mode) */
  }
  listeners.forEach((l) => l());
}

/** Switches theme with a soft cross-fade where the browser supports view transitions. */
export function toggleTheme() {
  const next = read() === "dark" ? "light" : "dark";
  track("theme_toggle", { theme: next });
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (doc.startViewTransition && !reduced) doc.startViewTransition(() => setTheme(next));
  else setTheme(next);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => "dark");
}

/** The opposite of the current theme — used by the inverted "30%" sections. */
export function useInverseTheme(): Theme {
  return useTheme() === "dark" ? "light" : "dark";
}
