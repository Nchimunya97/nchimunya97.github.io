import type { FirebaseApp } from "firebase/app";

/**
 * Firebase web config. These values are public by design (they identify the
 * project, they don't grant access) — Firestore security rules in
 * /firestore.rules are what protect the data.
 */
const firebaseConfig = {
  apiKey: "AIzaSyAaPHjh5jatcWMrSe4ctIrwgc7pr0ZoBxc",
  authDomain: "portfolio-website-d1aaa.firebaseapp.com",
  projectId: "portfolio-website-d1aaa",
  storageBucket: "portfolio-website-d1aaa.firebasestorage.app",
  messagingSenderId: "740491932423",
  appId: "1:740491932423:web:8781e38f302d583c6c4ba2",
  measurementId: "G-8SNCY0YM7D",
};

let appPromise: Promise<FirebaseApp> | null = null;

// Firebase is loaded lazily so it never slows down the first paint.
function getFirebaseApp() {
  appPromise ??= import("firebase/app").then(({ initializeApp }) =>
    initializeApp(firebaseConfig),
  );
  return appPromise;
}

/** Starts Google Analytics — only on the production deploy, so dev/stage traffic doesn't skew stats. */
export async function initAnalytics() {
  if (import.meta.env.VITE_DEPLOY_ENV !== "production") return;
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
