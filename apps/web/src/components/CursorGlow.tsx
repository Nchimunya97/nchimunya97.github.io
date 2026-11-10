import { useEffect, useRef } from "react";
import { useMediaQuery } from "../lib/hooks.ts";

/**
 * A soft copper light that trails the cursor across the whole page (it's
 * fixed to the viewport, so it stays with you while you scroll), plus a dot
 * grid that's only revealed around the pointer.
 */
export function CursorGlow() {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const glowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!finePointer) return;
    const layers = [glowRef.current, gridRef.current].filter(Boolean) as HTMLDivElement[];
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;
    let tx = x;
    let ty = y;
    let raf = 0;
    let shown = false;
    const ease = reduced ? 1 : 0.16;

    const apply = () => {
      for (const el of layers) {
        el.style.setProperty("--gx", `${x}px`);
        el.style.setProperty("--gy", `${y}px`);
      }
    };

    const loop = () => {
      x += (tx - x) * ease;
      y += (ty - y) * ease;
      apply();
      raf = Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3 ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        x = tx;
        y = ty;
        layers.forEach((el) => (el.style.opacity = "1"));
      }
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      shown = false;
      layers.forEach((el) => (el.style.opacity = "0"));
    };
    // a quick flare on click
    const onDown = () => glowRef.current?.classList.add("is-pressed");
    const onUp = () => glowRef.current?.classList.remove("is-pressed");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [finePointer, reduced]);

  if (!finePointer) return null;

  return (
    <>
      <div ref={gridRef} aria-hidden className="cursor-grid" />
      <div ref={glowRef} aria-hidden className="cursor-glow" />
    </>
  );
}
