// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD5PLkEe_B9uTRtdsW8eg-LATnAv-ydUrU",
  authDomain: "thivithan-now.firebaseapp.com",
  projectId: "thivithan-now",
  storageBucket: "thivithan-now.firebasestorage.app",
  messagingSenderId: "339702057294",
  appId: "1:339702057294:web:ea49672aecaa5e0664361f",
  measurementId: "G-1FCXPJ72FZ"
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage }; 