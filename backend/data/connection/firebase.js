// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {Auth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-gYo8gCAACzJIu0tPqZ16tdLPK4fmMBs",
  authDomain: "mest-3b41d.firebaseapp.com",
  projectId: "mest-3b41d",
  storageBucket: "mest-3b41d.appspot.com",
  messagingSenderId: "801879872668",
  appId: "1:801879872668:web:caf845c0eb4bbe498c8959",
  measurementId: "G-60BRD6ER5K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = app.auth()