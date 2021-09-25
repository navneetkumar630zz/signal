import * as Firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';

const firebase = Firebase.default;

const app = firebase.apps.length
  ? firebase.app()
  : firebase.initializeApp(firebaseConfig);

const db = app.firestore();

const auth = firebase.auth();

export { db, auth };
