import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAjwlbYRy51NGL_yqZPHYueA00xeIB0sc8",
  authDomain: "realwages-6cd77.firebaseapp.com",
  projectId: "realwages-6cd77",
  storageBucket: "realwages-6cd77.appspot.com",
  messagingSenderId: "676234288617",
  appId: "1:676234288617:web:063e1fcc2ed73eca283f78",
  measurementId: "G-Z9YEXX56XT"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get the Firebase Authentication service
const auth = getAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const handleSignUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

const handleLogin = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export { auth, handleSignUp, handleLogin };