import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

export async function initializeFirebase(): Promise<{
  app: FirebaseApp;
  db: Firestore;
  storage: FirebaseStorage;
}> {
  if (app && db && storage) {
    return { app, db, storage };
  }

  let config;

  try {
    // Try to fetch Firebase config from hosting auto-init (production)
    const response = await fetch("/__/firebase/init.json");

    if (response.ok) {
      const text = await response.text();
      try {
        config = JSON.parse(text);
      } catch (parseError) {
        // If it's not JSON (likely HTML from 404), fall back to env vars
        throw new Error("Not JSON response");
      }
    } else {
      throw new Error("Hosting config not available");
    }
  } catch (error) {
    // Fall back to environment variables for local development
    console.log(
      "Using environment variables for Firebase config (local development)"
    );

    config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    // Validate that we have the required config
    if (!config.apiKey || !config.projectId) {
      throw new Error(
        "Firebase configuration is missing. Please check your .env.local file and ensure all VITE_FIREBASE_* variables are set."
      );
    }
  }

  app = initializeApp(config);
  db = getFirestore(app);
  storage = getStorage(app);

  return { app, db, storage };
}

export { app, db, storage };
