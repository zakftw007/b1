// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0HhmUKN9iRWIBHP4EUBP-SMYFXd6aFCc",
  authDomain: "budgeting-7b97f.firebaseapp.com",
  projectId: "budgeting-7b97f",
  storageBucket: "budgeting-7b97f.firebasestorage.app",
  messagingSenderId: "225595829636",
  appId: "1:225595829636:web:828ad6fa86cb4b555e41d1",
  measurementId: "G-LDM0R6WR4K"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };