import { useState, useEffect } from 'react';
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsM3NXVAVsEvusFewssHnXAZPeUG2smz0",
  authDomain: "test-dca57.firebaseapp.com",
  projectId: "test-dca57",
  storageBucket: "test-dca57.appspot.com",
  messagingSenderId: "86742867263",
  appId: "1:86742867263:web:431ffc4c1c817ec7db878a",
  measurementId: "G-HFZY5WLJR3"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export const useFirebase = () => {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  return { auth, db, signInWithGoogle };
};
