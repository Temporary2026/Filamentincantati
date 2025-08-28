// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMjN4q74PbJPDGgpCdYk8nNz31UKxYxrM",
  authDomain: "filamentincantati-82f9b.firebaseapp.com",
  projectId: "filamentincantati-82f9b",
  storageBucket: "filamentincantati-82f9b.appspot.com",
  messagingSenderId: "668228235353",
  appId: "1:668228235353:web:14e0336139bd3687d70148",
  measurementId: "G-WP0P0YJWD9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
