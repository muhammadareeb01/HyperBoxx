// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQOqio9g4AGYIMkdRkH-mRLH1loWZQfBo",
  authDomain: "hyperboxes-backend.firebaseapp.com",
  projectId: "hyperboxes-backend",
  storageBucket: "hyperboxes-backend.firebasestorage.app",
  messagingSenderId: "1098381263682",
  appId: "1:1098381263682:web:64e58e0e394e70b3dbbedb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();