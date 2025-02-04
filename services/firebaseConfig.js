// services/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import additional Firebase services if needed:
// import { getAuth } from 'firebase/auth';
// import { getStorage } from 'firebase/storage';

// These values can come from your Firebase Console settings or from a web config version of google-services.json
// you can find them under "Project Settings" → "General" → "Your apps" → "SDK setup and configuration".
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBSGnby3jqnORmz257ecLwvBTR4df2b5-M",
    authDomain: "quickbites-ea42b.firebaseapp.com",
    projectId: "quickbites-ea42b",
    storageBucket: "quickbites-ea42b.firebasestorage.app",
    messagingSenderId: "860255131401",
    appId: "1:860255131401:web:2b12df256c978223d725d8"
  };

// Initialize the Firebase App
const app = initializeApp(firebaseConfig);

// Export the services you need
export const db = getFirestore(app);
// export const auth = getAuth(app);
// export const storage = getStorage(app);
