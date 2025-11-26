import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Konfigurasi Firebase Anda
// GANTI dengan konfigurasi dari Firebase Console Anda
const firebaseConfig = {
  apiKey: "AIzaSyBdXRKoFeWTsS4ZkqRI6Qaba2pVPMHY8t0",
  authDomain: "aplikasi-apotek-9ab41.firebaseapp.com",
  projectId: "aplikasi-apotek-9ab41",
  storageBucket: "aplikasi-apotek-9ab41.firebasestorage.app",
  messagingSenderId: "854052947930",
  appId: "1:854052947930:web:09b7fb0582f81f77f6a2e3",
  measurementId: "G-8S80HWCQKR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

// Export untuk digunakan di file lain
export { db, auth };