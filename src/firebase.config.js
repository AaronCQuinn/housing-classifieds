// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFTjJytQwam4AyAQMz9Pad2-otXjQ35OU",
  authDomain: "house-classifieds.firebaseapp.com",
  projectId: "house-classifieds",
  storageBucket: "house-classifieds.appspot.com",
  messagingSenderId: "1023839631434",
  appId: "1:1023839631434:web:7c060aca138052dfd5ceb3",
  measurementId: "G-E0WJ7ZYTNK"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();