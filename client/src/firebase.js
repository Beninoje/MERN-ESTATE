// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-af733.firebaseapp.com",
  projectId: "mern-estate-af733",
  storageBucket: "mern-estate-af733.appspot.com",
  messagingSenderId: "361747843136",
  appId: "1:361747843136:web:aa3c994268e27cc683f7a5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);