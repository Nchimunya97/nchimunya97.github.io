import type { FirebaseApp } from "firebase/app";
import type { Analytics } from "firebase/analytics";

/**
 * Firebase web config, read from environment variables at build time:
 * apps/web/.env locally (gitignored) and repository secrets in GitHub Actions.
 * See apps/web/.env.example. Firestore security rules (/firestore.rules) and
 * API-key restrictions in Google Cloud are what actually protect the project.
 */
const env = import.meta.env;
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};

/** False when the env vars are missing — the site still works without Firebase. */
export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let appPromise: Promise<FirebaseApp> | null = null;

// Firebase is loaded lazily so it never slows down the first paint.
function getFirebaseApp() {
  if (!firebaseEnabled) return Promise.reject(new Error("Firebase is not configured"));
  appPromise ??= import("firebase/app").then(({ initializeApp }) =>
    initializeApp(firebaseConfig),
  );
  return appPromise;
}

const analyticsOn = firebaseEnabled && import.meta.env.VITE_DEPLOY_ENV === "production";
let analyticsPromise: Promise<Analytics | null> | null = null;

/** Starts Google Analytics — only on the production deploy, so dev/stage traffic doesn't skew stats. */
export function initAnalytics() {
  if (!analyticsOn) return Promise.resolve(null);
  analyticsPromise ??= (async () => {
    try {
      const [{ getAnalytics, isSupported }, app] = await Promise.all([
        import("firebase/analytics"),
        getFirebaseApp(),
      ]);
      return (await isSupported()) ? getAnalytics(app) : null;
    } catch {
      return null; // analytics is best-effort (ad blockers etc.)
    }
  })();
  return analyticsPromise;
}

export type EventName =
  | "cv_download"
  | "project_open"
  | "contact_submit"
  | "testimonial_submit"
  | "copy_contact"
  | "outbound_click"
  | "skill_select"
  | "palette_open"
  | "theme_toggle";

/**
 * Records a custom analytics event (Firebase console → Analytics → Events).
 * A no-op outside production; in dev it just logs to the console.
 */
export function track(name: EventName, params?: Record<string, string | number>) {
  if (!analyticsOn) {
    if (import.meta.env.DEV) console.debug("[track]", name, params ?? {});
    return;
  }
  void initAnalytics()
    .then(async (analytics) => {
      if (!analytics) return;
      const { logEvent } = await import("firebase/analytics");
      logEvent(analytics, name, params);
    })
    .catch(() => {});
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

/** Saves a contact-form message to the Firestore `messages` collection. */
export async function saveMessage(msg: ContactMessage) {
  const [{ getFirestore, collection, addDoc, serverTimestamp }, app] = await Promise.all([
    import("firebase/firestore"),
    getFirebaseApp(),
  ]);
  await addDoc(collection(getFirestore(app), "messages"), {
    name: msg.name,
    email: msg.email,
    message: msg.message,
    page: window.location.href.slice(0, 300),
    createdAt: serverTimestamp(),
  });
}

/* ------------------------------------------------------------------ */
/*  Testimonials — moderated: visitors submit, the owner approves by   */
/*  setting `approved: true` in the Firebase console.                  */
/* ------------------------------------------------------------------ */

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  createdAt: number;
}

type RestValue = { stringValue?: string; timestampValue?: string; booleanValue?: boolean };
type RestDoc = { name: string; fields?: Record<string, RestValue> };

/**
 * Approved testimonials only. Uses Firestore's REST API (a single small fetch)
 * instead of the ~160 KB Firestore SDK, since most visitors never submit one.
 * Resolves to [] on any failure, so the section simply stays hidden.
 */
export async function fetchApprovedTestimonials(): Promise<Testimonial[]> {
  if (!firebaseEnabled) return [];
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents:runQuery?key=${firebaseConfig.apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "testimonials" }],
          where: {
            fieldFilter: { field: { fieldPath: "approved" }, op: "EQUAL", value: { booleanValue: true } },
          },
          limit: 12,
        },
      }),
    });
    if (!res.ok) return [];
    const rows = (await res.json()) as Array<{ document?: RestDoc }>;
    return rows
      .filter((r): r is { document: RestDoc } => !!r.document?.fields)
      .map(({ document: d }) => {
        const f = d.fields ?? {};
        return {
          id: d.name.split("/").pop() ?? d.name,
          name: f.name?.stringValue ?? "",
          role: f.role?.stringValue ?? "",
          text: f.text?.stringValue ?? "",
          createdAt: Date.parse(f.createdAt?.timestampValue ?? "") || 0,
        };
      })
      .filter((t) => t.name && t.text)
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export interface TestimonialSubmission {
  name: string;
  role: string;
  email: string;
  text: string;
}

/**
 * Writes the public part to `testimonials` (approved: false) and the email —
 * which is never shown — to a separate create-only `testimonialContacts` doc
 * with the same id, in one atomic batch.
 */
export async function submitTestimonial(t: TestimonialSubmission) {
  const [{ getFirestore, collection, doc, writeBatch, serverTimestamp }, app] = await Promise.all([
    import("firebase/firestore"),
    getFirebaseApp(),
  ]);
  const db = getFirestore(app);
  const ref = doc(collection(db, "testimonials"));
  const batch = writeBatch(db);
  batch.set(ref, {
    name: t.name,
    role: t.role,
    text: t.text,
    consent: true,
    approved: false,
    createdAt: serverTimestamp(),
  });
  batch.set(doc(db, "testimonialContacts", ref.id), { email: t.email, createdAt: serverTimestamp() });
  await batch.commit();
}
