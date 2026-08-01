import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "m-tech-solutions-9380",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:747616618198:web:1565c021d7f483d52c6b77",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "m-tech-solutions-9380.firebasestorage.app",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "m-tech-solutions-9380.firebaseapp.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "747616618198",
  projectNumber: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "747616618198"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
