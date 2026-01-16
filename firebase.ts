
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// In this environment, __firebase_config is injected
// Fallback is only for local dev purposes if needed
const firebaseConfig = typeof (window as any).__firebase_config !== 'undefined' 
  ? JSON.parse((window as any).__firebase_config) 
  : { apiKey: "fake-key", authDomain: "fake-auth", projectId: "fake-project" };

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = (window as any).__app_id || 'n4-kanji-srs-v3';
