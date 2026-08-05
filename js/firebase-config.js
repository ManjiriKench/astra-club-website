// A.S.T.R.A Firebase Configuration & Initialization
// Replace placeholders with your Firebase project credentials from Firebase Console.

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase if compat SDK is loaded and valid key is present
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
      console.warn("⚠️ Firebase Initialization warning, operating in local mode:", e);
    }
  } else {
    console.warn("⚠️ Firebase API Key set to placeholder. Operating in local mode.");
  }
}

// Auto initialize when script loads
initFirebase();

// Live Firebase Mode Active (Set window.DEMO_MODE = false)
window.DEMO_MODE = false;

