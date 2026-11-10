import Lenis from "lenis";

/**
 * Inertia-style smooth scrolling for mouse wheels and trackpads.
 * Touch devices keep native scrolling (it already feels right there), and
 * reduced-motion users get plain scrolling.
 */
let lenis: Lenis | null = null;

export function initSmoothScroll() {
  if (lenis || typeof window === "undefined") return lenis;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 0.9,
    smoothWheel: true,
    syncTouch: false,
    anchors: false,
  });
  document.documentElement.classList.add("lenis-on");

  const raf = (time: number) => {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  return lenis;
}

export function getLenis() {
  return lenis;
}

// Lenis already honours `scroll-padding-top` on <html> (set in index.css to clear
// the fixed navbar), so no extra offset is needed here.
export function smoothScrollTo(target: HTMLElement | number) {
  if (lenis) {
    lenis.scrollTo(target, {
      duration: 1.4,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target });
  else target.scrollIntoView();
}

export function pauseSmoothScroll(paused: boolean) {
  if (!lenis) return;
  if (paused) lenis.stop();
  else lenis.start();
}
