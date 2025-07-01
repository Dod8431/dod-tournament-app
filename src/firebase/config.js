// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCx3qI-k7bLr3nhlE0gvXP3kkCxRCdUVdc",
  authDomain: "tournamentapp-6f64b.firebaseapp.com",
  projectId: "tournamentapp-6f64b",
  storageBucket: "tournamentapp-6f64b.appspot.com", // <-- Fixed typo here!
  messagingSenderId: "275384268022",
  appId: "1:275384268022:web:ade4acafb3ae1d273e28d7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
