import type { FirebaseApp } from "firebase/app";

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

/** Starts Google Analytics — only on the production deploy, so dev/stage traffic doesn't skew stats. */
export async function initAnalytics() {
  if (!firebaseEnabled || import.meta.env.VITE_DEPLOY_ENV !== "production") return;
  try {
    const [{ getAnalytics, isSupported }, app] = await Promise.all([
      import("firebase/analytics"),
      getFirebaseApp(),
    ]);
    if (await isSupported()) getAnalytics(app);
  } catch {
    /* analytics is best-effort (ad blockers etc.) */
  }
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
