// A.S.T.R.A Firebase Configuration Template
// Copy this file to `js/firebase-config.js` and insert your Firebase project credentials.

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase if compat SDK is loaded
let app, auth, db, storage;

function initFirebase() {
  if (typeof firebase !== 'undefined' && firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY") {
    try {
      if (!firebase.apps.length) {
        app = firebase.initializeApp(firebaseConfig);
      } else {
        app = firebase.app();
      }
      auth = firebase.auth();
      db = firebase.firestore();
      storage = firebase.storage();
      console.log("⚡ A.S.T.R.A Firebase Initialized Successfully");
    } catch (e) {
      console.warn("⚠️ Firebase Initialization warning:", e);
    }
  } else {
    console.warn("⚠️ Firebase API Key set to placeholder. Operating in local mode.");
  }
}

initFirebase();
window.DEMO_MODE = false;
