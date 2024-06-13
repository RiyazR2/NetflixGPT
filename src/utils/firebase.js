// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAcdVZLQreP-pHLoj2LbXiCwj65s5pLu_w",
    authDomain: "netflixgpt-d91a2.firebaseapp.com",
    projectId: "netflixgpt-d91a2",
    storageBucket: "netflixgpt-d91a2.appspot.com",
    messagingSenderId: "654353682956",
    appId: "1:654353682956:web:b14990585881002a7b5429",
    measurementId: "G-RRRLNJKCB1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth()
