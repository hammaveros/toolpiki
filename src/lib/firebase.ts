import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDI-0NY4DkzHSMTfyj64lszgfiL5IYYLDo',
  authDomain: 'hammaveros-eb777.firebaseapp.com',
  projectId: 'hammaveros-eb777',
  storageBucket: 'hammaveros-eb777.firebasestorage.app',
  messagingSenderId: '761861434261',
  appId: '1:761861434261:web:9ef9073bd8c26bb8d4649c',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
