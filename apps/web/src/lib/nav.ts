export const NAV_ITEMS = [
  { id: "work", label: "Work" },
  { id: "hytel", label: "Hytel" },
  { id: "about", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "toolkit", label: "Toolkit" },
  { id: "contact", label: "Contact" },
] as const;

export const SECTION_IDS: string[] = ["home", ...NAV_ITEMS.map((n) => n.id)];

/** Sections painted in the inverted (30%) colour — the navbar adapts over them. */
export const INVERTED_SECTION_IDS: string[] = ["hytel", "journey", "testimonials"];
