import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBh2Qn0b6b67gcI3l9avyN5ps449FIbPFs",
  authDomain: "sample-firebase-ai-app-21cc6.firebaseapp.com",
  projectId: "sample-firebase-ai-app-21cc6",
  storageBucket: "sample-firebase-ai-app-21cc6.appspot.com",
  messagingSenderId: "212777639542",
  appId: "1:212777639542:web:06cd1584135ce58de08957",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const functions = getFunctions(app);
