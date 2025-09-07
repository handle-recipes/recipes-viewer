import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

export async function initializeFirebase(): Promise<{ app: FirebaseApp; db: Firestore; storage: FirebaseStorage }> {
  if (app && db && storage) {
    return { app, db, storage };
  }

  try {
    const response = await fetch('/__/firebase/init.json');
    const config = await response.json();
    
    app = initializeApp(config);
    db = getFirestore(app);
    storage = getStorage(app);
    
    return { app, db, storage };
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    throw error;
  }
}

export { app, db, storage };