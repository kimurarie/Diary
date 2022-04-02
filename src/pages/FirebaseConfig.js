import {initializeApp} from "firebase/app";
import "firebase/database";
import 'firebase/auth';
import { getDatabase } from "firebase/database";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBlXp6j3r-IabFU8fA7kxfyvqmENUx8-5A",
  authDomain: "diary-a2c50.firebaseapp.com",
  databaseURL: "https://diary-a2c50-default-rtdb.firebaseio.com",
  projectId: "diary-a2c50",
  storageBucket: "diary-a2c50.appspot.com",
  messagingSenderId: "961298694667",
  appId: "1:961298694667:web:585aad9e107a6bf6d6bd0e"
});

export default firebaseApp;
export const database = getDatabase(firebaseApp);