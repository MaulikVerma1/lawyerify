'use client'

import { useEffect } from 'react';
import { useFirebase } from '../hooks/useFirebase';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { auth } = useFirebase();

  useEffect(() => {
    if (auth) {
      const unsubscribe = auth.onAuthStateChanged(() => {
        // You can add logic here if needed
      });

      return () => unsubscribe();
    }
  }, [auth]);

  return <>{children}</>;
}
