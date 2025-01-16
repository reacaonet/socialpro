import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDHbghKmFw9K_J8Wmhfx-lZo8sDdizdRsA",
  authDomain: "itamidia-iptv.firebaseapp.com",
  databaseURL: "https://itamidia-iptv.firebaseio.com",
  projectId: "itamidia-iptv",
  storageBucket: "itamidia-iptv.firebasestorage.app",
  messagingSenderId: "1008060368698",
  appId: "1:1008060368698:android:42057146c5cfc462dc7203"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
