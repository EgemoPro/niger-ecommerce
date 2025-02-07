// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";

// import {} from "firebase-admin"
const firebaseConfig = {
  apiKey: "AIzaSyDzZHC5d4p9Y_hY5kSh2BCJ8EJnI5jwoDc",
  authDomain: "e-commerce-20c37.firebaseapp.com",
  projectId: "e-commerce-20c37",
  storageBucket: "e-commerce-20c37.firebasestorage.app",
  messagingSenderId: "458716048544",
  appId: "1:458716048544:web:74b815bcac186022e42dc5",
  measurementId: "G-Z9HMQDSWH2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
})
const googleSignInWithRedirect = ()=> signInWithRedirect(auth, googleProvider)
const googleSignInWithPopup = ()=> signInWithPopup(auth, googleProvider)

export { googleSignInWithRedirect, googleSignInWithPopup };