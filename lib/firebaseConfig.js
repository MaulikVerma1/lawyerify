// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBsM3NXVAVsEvusFewssHnXAZPeUG2smz0",
  authDomain: "test-dca57.firebaseapp.com",
  projectId: "test-dca57",
  storageBucket: "test-dca57.appspot.com",
  messagingSenderId: "86742867263",
  appId: "1:86742867263:web:431ffc4c1c817ec7db878a",
  measurementId: "G-HFZY5WLJR3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);



