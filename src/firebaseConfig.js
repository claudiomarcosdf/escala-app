import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBMXjKcw7613KGNejHXEPw1or9daZKwOFM',
  authDomain: 'escalaapp-16be0.firebaseapp.com',
  databaseURL: 'https://escalaapp-16be0-default-rtdb.firebaseio.com',
  projectId: 'escalaapp-16be0',
  storageBucket: 'escalaapp-16be0.appspot.com',
  messagingSenderId: '537702009562',
  appId: '1:537702009562:web:b197ddc84d948c599133e3',
  measurementId: 'G-PFQLQ6FJ2L'
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
