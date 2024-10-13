import { useState, useEffect, useMemo } from 'react';
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { app, auth as firebaseAuth, googleProvider } from '../firebase/firebaseConfig';
import { doc } from "firebase/firestore";

export function useFirebase() {
  const auth = useMemo(() => firebaseAuth, [])
  const db = useMemo(() => getFirestore(app), [])

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, [auth]);

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      console.error("Auth or Google Provider not initialized");
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User signed in with Google:", user);
      return user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const loadUserProgress = async (userId: string) => {
    if (!auth.currentUser) {
      console.error("User not authenticated");
      return;
    }
    
    const userDocRef = doc(db, 'users', userId)
    // Implement the actual loading logic here
  }

  const saveUserProgress = async (userId: string, progressData: any) => {
    if (!auth.currentUser) {
      console.error("User not authenticated");
      return;
    }
    
    const userDocRef = doc(db, 'users', userId)
    // Implement the actual saving logic here
  }

  return { app, auth, db, signInWithGoogle, loadUserProgress, saveUserProgress, isAuthenticated };
}
