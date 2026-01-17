
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// In this environment, __firebase_config is injected
// Fallback is only for local dev purposes if needed
const firebaseConfig = typeof (window as any).__firebase_config !== 'undefined'
  ? JSON.parse((window as any).__firebase_config)
  : {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "fake-key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fake-auth",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fake-project",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = (window as any).__app_id || 'n4-kanji-srs-v3';
