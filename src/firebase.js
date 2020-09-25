import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_PRIVATE_KEY,
  authDomain: "portero-c1d18.firebaseapp.com",
  databaseURL: "https://portero-c1d18.firebaseio.com/",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: "portero-c1d18.appspot.com",
  messagingSenderId: "1413285930",
  appId: "1:1413285930:web:fbaf3f27629bb4a87e9b53",
  measurementId: "G-TMT1ESTR7B",
};
// Initialize Firebase
const fb = firebase.initializeApp(firebaseConfig);

export const auth = fb.auth()
export const db = fb.firestore();
