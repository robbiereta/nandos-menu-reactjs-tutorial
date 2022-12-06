// import firebase from "firebase";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDfK50urD2gZuqgVCO4s662se4edn-7Vx8",
  authDomain: "proyecto-c6f98.firebaseapp.com",
  projectId: "proyecto-c6f98",
  storageBucket: "proyecto-c6f98.appspot.com",
  messagingSenderId: "8489633667",
  appId: "1:8489633667:web:4d57d0201c4daad5b318b6",
  measurementId: "G-JWGXNE88TH"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
export { db };