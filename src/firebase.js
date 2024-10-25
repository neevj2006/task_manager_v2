// Firebase configuration and initialization file
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// Sets up Firebase with environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initializes and exports Firebase services:
const app = initializeApp(firebaseConfig);

// Authentication (auth) with Google sign-in support
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore database (db) for data storage
export const db = getFirestore(app);

// Cloud Functions (functions) for serverless operations
export const functions = getFunctions(app);
