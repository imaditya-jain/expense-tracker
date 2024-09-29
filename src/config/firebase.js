// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDWQiCrNUe8eu-mXJH46Keyb3mSb1CYBmg",
    authDomain: "todo---react-and-firebase.firebaseapp.com",
    projectId: "todo---react-and-firebase",
    storageBucket: "todo---react-and-firebase.appspot.com",
    messagingSenderId: "204498977088",
    appId: "1:204498977088:web:c5fbc7bf8634f3c11a7aa5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
const storage = getStorage(app)

export { auth, db, storage }