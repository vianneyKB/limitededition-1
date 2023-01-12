// first we import firebase modules
import {GoogleAuthProvider, getAuth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut} from "firebase/auth" 
import { getFirestore, query, getDocs, collection, where, addDoc} from "firebase/firestore";

// initialize Firebase and begin using the SDKs for the products
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD63kKh0P84Jh9DarMWrlx3XaQLNtnHvr4",
  authDomain: "limitededition-2bca3.firebaseapp.com",
  projectId: "limitededition-2bca3",
  storageBucket: "limitededition-2bca3.appspot.com",
  messagingSenderId: "233081903869",
  appId: "1:233081903869:web:4e1e969387d8e490cbbc94",
  measurementId: "G-47VGQ2EDL3"
};

// Let’s initialize our app and services so that we can use Firebase throughout our app
// This will use our config to recognize the project and initialize authentication and database modules
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// getting the Auth
const auth = getAuth(app);
const db = getFirestore(app);

// adding now the Google Authentication function
const googleProvider = new GoogleAuthProvider();
// using a try…catch block along with async functions 
// so that we can handle errors easily and avoid callbacks as much as possible.
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// now the function for signing in using an email and password
const logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

// let create a function for registering a user with an email and password
const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

// this next function that will send a password reset link to an email address
const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

// now the logout function
const logout = () => {
    signOut(auth);
  };

// so we need to export everything so here it is
export {
    auth,
    db,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    logout,
  };