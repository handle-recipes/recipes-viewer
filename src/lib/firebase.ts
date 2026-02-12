import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const app = initializeApp({
  apiKey: "AIzaSyAFwIfwVCpCUw8ESyCN_V0a7sS95QddWaw",
  authDomain: "bekk-recipes-mcp.firebaseapp.com",
  projectId: "bekk-recipes-mcp",
  storageBucket: "bekk-recipes-mcp.firebasestorage.app",
  messagingSenderId: "502037431705",
  appId: "1:502037431705:web:cb4f119b047b38a41e7f08",
});

export const db = getFirestore(app);
export const storage = getStorage(app);
