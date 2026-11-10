import { profile } from "@portfolio/content";
import { toast } from "./toast.ts";
import { getLenis, smoothScrollTo } from "./smooth-scroll.ts";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const cvUrl = `${import.meta.env.BASE_URL}${profile.cvFile}`;

export async function copyText(text: string, label = "Copied to clipboard") {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const el = document.createElement("textarea");
      el.value = text;
      el.setAttribute("readonly", "");
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    }
    toast(label);
  } catch {
    toast("Couldn't copy — please copy it manually");
  }
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (getLenis()) smoothScrollTo(id === "home" ? 0 : el);
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  history.replaceState(null, "", `#${id}`);
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isMac() {
  return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/** Format a phone number like +260 767 670 464 */
export function formatPhone(raw: string) {
  const m = raw.match(/^\+(\d{3})(\d{3})(\d{3})(\d{3})$/);
  return m ? `+${m[1]} ${m[2]} ${m[3]} ${m[4]}` : raw;
}
