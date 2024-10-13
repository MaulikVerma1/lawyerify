'use client'

import { useEffect, useState } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { User } from 'firebase/auth';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { auth } = useFirebase();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (auth) {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if (authUser) {
          setUser(authUser);
        } else {
          setUser(null);
        }
      });

      return () => unsubscribe();
    }
  }, [auth]);

  return (
    <div>
      {/* Your layout components */}
      {children}
    </div>
  );
}

