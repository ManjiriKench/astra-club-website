// A.S.T.R.A Firebase Configuration & Initialization
// Replace the config object below with your actual Firebase project credentials from Firebase Console.

const firebaseConfig = {
  apiKey: "AIzaSyCPOCzCqfh7bFnpjujZLs-0d4EI9jGTJbE",
  authDomain: "astra-club-website.firebaseapp.com",
  projectId: "astra-club-website",
  storageBucket: "astra-club-website.firebasestorage.app",
  messagingSenderId: "572207393608",
  appId: "1:572207393608:web:aafc96239e34ed89e5217d",
  measurementId: "G-HLRYKQTL2P"
};

// Initialize Firebase if compat SDK is loaded
let app, auth, db, storage;

function initFirebase() {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
      app = firebase.initializeApp(firebaseConfig);
    } else {
      app = firebase.app();
    }
    auth = firebase.auth();
    db = firebase.firestore();
    storage = firebase.storage();
    console.log("⚡ A.S.T.R.A Firebase Initialized Successfully");
  } else {
    console.warn("⚠️ Firebase SDK not loaded yet.");
  }
}

// Auto initialize when script loads
initFirebase();

// Live Firebase Mode Active (Set window.DEMO_MODE = false to use Firestore DB)
window.DEMO_MODE = false;

