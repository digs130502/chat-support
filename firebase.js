// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkds4axFNEcjk0S0744CpNYWsV1eYFwts",
  authDomain: "support-feedback-23cd4.firebaseapp.com",
  projectId: "support-feedback-23cd4",
  storageBucket: "support-feedback-23cd4.appspot.com",
  messagingSenderId: "937242061309",
  appId: "1:937242061309:web:009c5ce88bcd24ac2a1194",
  measurementId: "G-YDH1D53KDP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
