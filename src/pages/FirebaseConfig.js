// import { firebase } from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
// import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBlXp6j3r-IabFU8fA7kxfyvqmENUx8-5A",
  authDomain: "diary-a2c50.firebaseapp.com",
  projectId: "diary-a2c50",
  storageBucket: "diary-a2c50.appspot.com",
  messagingSenderId: "961298694667",
  appId: "1:961298694667:web:585aad9e107a6bf6d6bd0e"
};

const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;
export const database = getDatabase(firebaseApp);

// const firebaseConfig = {
//     apiKey: "AIzaSyBp8AUGnJHlbqoAubCj1V4nZm_Z3x3WSE8",
//     authDomain: "diary-d3f4a.firebaseapp.com",
//     projectId: "diary-d3f4a",
//     storageBucket: "diary-d3f4a.appspot.com",
//     messagingSenderId: "748762685907",
//     appId: "1:748762685907:web:36c4505e378cbb9a18cf26"
// };

// firebase.initializeApp(firebaseConfig);
// export default firebase;