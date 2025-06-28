import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_AUTH_DOMAIN || "",
  storageBucket: import.meta.env.VITE_AUTH_DOMAIN || "",
  messagingSenderId: import.meta.env.VITE_AUTH_DOMAIN || "",
  appId: import.meta.env.VITE_AUTH_DOMAIN || "",
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);