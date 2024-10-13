import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBsM3NXVAVsEvusFewssHnXAZPeUG2smz0",
  authDomain: "test-dca57.firebaseapp.com",
  projectId: "test-dca57",
  storageBucket: "test-dca57.appspot.com",
  messagingSenderId: "86742867263",
  appId: "1:86742867263:web:431ffc4c1c817ec7db878a",
  measurementId: "G-HFZY5WLJR3"
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let googleProvider: GoogleAuthProvider | undefined;

if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
}

export { app, auth, googleProvider };
