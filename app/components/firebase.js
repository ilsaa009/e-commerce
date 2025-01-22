import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_VbDXu-25OMYj0onZGli65BbYwDxpwzw",
  authDomain: "e-commerce-4d2e5.firebaseapp.com",
  projectId: "e-commerce-4d2e5",
  storageBucket: "e-commerce-4d2e5.firebasestorage.app",
  messagingSenderId: "849297935297",
  appId: "1:849297935297:web:8e0efe0edab601b4697d40",
  measurementId: "G-8PQKDTGLXH"
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export const signUpWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};
export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};
export const signInWithGitHub = () => {
  return signInWithPopup(auth, githubProvider);
};