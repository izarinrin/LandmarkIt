import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAgK4wMi-WeMKusTge8IP7vvipwAQmGf-E",
  authDomain: "landmarkit-55d09.firebaseapp.com",
  databaseURL:
    "https://landmarkit-55d09-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "landmarkit-55d09",
  storageBucket: "landmarkit-55d09.appspot.com",
  messagingSenderId: "124783203883",
  appId: "1:124783203883:web:3c154d32bb3c6329553c6e",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();

export { firebase, auth, database, storage };
