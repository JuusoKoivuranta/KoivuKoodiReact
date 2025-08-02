// src/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// TODO: Replace with your Firebase project configuration
// You can find this in your Firebase Console -> Project Settings -> General -> Your apps -> Web app
const firebaseConfig = {
  apiKey: "AIzaSyAu2RNTzXfAA5PioMjM2DX6cA8lwOKTj50",
  authDomain: "koivukoodi-gallery.firebaseapp.com",
  projectId: "koivukoodi-gallery",
  storageBucket: "koivukoodi-gallery.firebasestorage.app",
  messagingSenderId: "642202356302",
  appId: "1:642202356302:web:d222f8d77c67a0a6b6111f",
  measurementId: "G-6CE1GBE86P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);
